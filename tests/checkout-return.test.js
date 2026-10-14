const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../js/checkout-return.js'), 'utf8');
const paid = {
  paid: true, pending: false, livemode: true, internalTest: false,
  transactionId: 'cs_live_example', amountTotal: 300, currency: 'EUR',
  reportType: 'dk_ai_credit_risk', reportLang: 'en', taxTotal: 60, shippingTotal: 0,
};
const flush = () => new Promise(resolve => setImmediate(resolve));

function run(responses = [paid], { consent = true, storage = new Map(), search = '?session_id=cs_live_example', pathname = '/en/ai-credit-report/order/' } = {}) {
  const nodes = Object.fromEntries(['title', 'message', 'status', 'next'].map(key => [key, { textContent: '', hidden: true }]));
  const events = [], timers = [], listeners = {}, requests = [];
  let enabled = consent;
  let now = 0;
  const window = {
    location: { search, pathname },
    CRAnalytics: { isEnabled: () => enabled },
    gtag: (...args) => events.push(args),
    addEventListener: (name, callback) => { listeners[name] = callback; },
    setTimeout: (callback, delay) => timers.push({ callback: () => { now += delay; callback(); }, delay }),
  };
  vm.runInNewContext(source, {
    window, URLSearchParams, Date: { now: () => now },
    document: { querySelector: selector => nodes[selector.match(/checkout-(\w+)/)?.[1]] },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    fetch: async (url, options) => {
      requests.push({ url, options });
      const data = responses.length > 1 ? responses.shift() : responses[0];
      if (data instanceof Error) throw data;
      return { ok: true, json: async () => data };
    },
  });
  return { nodes, events, timers, storage, requests, window, elapsed: () => now, accept: () => { enabled = true; listeners['creditreports:analytics-ready'](); } };
}

test('verified paid purchase uses actual net/gross amounts and persistent dedup', async () => {
  const result = run();
  await flush();
  assert.equal(result.nodes.title.textContent, 'Payment confirmed');
  assert.equal(result.events.length, 2);
  assert.equal(result.events[0][1], 'purchase');
  assert.equal(result.events[0][2].value, 2.4);
  assert.equal(result.events[0][2].tax, 0.6);
  assert.equal(result.events[0][2].currency, 'EUR');
  assert.equal(result.events[1][1], 'ai_report_purchase_success');
  assert.equal(result.events[1][2].value, 3);
  assert.equal(result.requests[0].url, '/api/checkout-summary?session_id=cs_live_example');
  assert.equal(result.requests[0].options.cache, 'no-store');
  const refresh = run([paid], { storage: result.storage });
  await flush();
  assert.equal(refresh.events.length, 0);
});

test('authorization stays pending; captured payment emits once after polling', async () => {
  const result = run([{ paid: false, pending: true }, paid]);
  await flush();
  assert.equal(result.nodes.title.textContent, 'Payment pending');
  assert.equal(result.events.length, 0);
  assert.equal(result.storage.size, 0);
  assert.equal(result.timers[0].delay, 60000);
  result.timers.shift().callback();
  await flush();
  assert.equal(result.nodes.title.textContent, 'Payment confirmed');
  assert.equal(result.events.length, 2);
  assert.equal(result.timers.length, 0);
});

test('purchase waits for consent and does not mark before analytics is ready', async () => {
  const result = run([paid], { consent: false });
  await flush();
  assert.equal(result.events.length, 0);
  assert.equal(result.storage.size, 0);
  result.accept();
  assert.equal(result.events.length, 2);
  result.accept();
  assert.equal(result.events.length, 2);
});

test('test, internal, unpaid and foreign/malformed summaries never emit purchases', async () => {
  for (const response of [
    { ...paid, livemode: false }, { ...paid, internalTest: true },
    { ...paid, internalTest: undefined }, { ...paid, paid: false },
    { ...paid, transactionId: 'cs_other' }, { ...paid, amountTotal: 0 },
    { ...paid, taxTotal: 900 }, { ...paid, currency: 'USD' },
    new Error('Unavailable'),
  ]) {
    const result = run([response]);
    await flush();
    assert.equal(result.events.length, 0);
    assert.equal(result.storage.size, 0);
  }
});

test('a thank-you visit without a session does not claim payment or fetch', async () => {
  const result = run([paid], { search: '', pathname: '/en/thankyou/' });
  await flush();
  assert.equal(result.requests.length, 0);
  assert.equal(result.events.length, 0);
  assert.equal(result.nodes.title.textContent, 'No payment to confirm');
});

test('an analytics failure leaves the verified payment visible and does not mark dedup', async () => {
  const result = run();
  result.window.gtag = () => { throw new Error('Analytics unavailable'); };
  await flush();
  assert.equal(result.nodes.title.textContent, 'Payment confirmed');
  assert.equal(result.storage.size, 0);
});

test('pending polling includes the final 32-minute check and then stops', async () => {
  const result = run([{ paid: false, pending: true }]);
  for (let i = 0; i < 33; i++) {
    await flush();
    result.timers.shift()?.callback();
  }
  assert.equal(result.requests.length, 33);
  assert.equal(result.elapsed(), 32 * 60000);
  assert.equal(result.timers.length, 0);
  assert.equal(result.nodes.title.textContent, 'Payment still pending');
});
