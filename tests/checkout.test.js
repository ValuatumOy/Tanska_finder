const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/checkout.js'), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

function run(quote) {
  const nodes = {}, listeners = {}, requests = [];
  for (const id of ['orderModalOverlay', 'orderConfirmModal', 'orderConfirmClose', 'orderConfirmSubmit', 'orderConfirmCompany', 'orderConfirmPrice', 'orderConfirmError']) {
    nodes[id] = {
      textContent: id === 'orderConfirmSubmit' ? 'Continue to payment' : '',
      classList: { add() {}, remove() {}, contains() { return true; } },
      setAttribute() {}, focus() {},
      addEventListener: (name, callback) => { listeners[id + ':' + name] = callback; },
    };
  }
  const window = { location: { pathname: '/en/ai-credit-report/order/' }, setTimeout() {}, addEventListener() {} };
  vm.runInNewContext(source, {
    window, Intl, console,
    document: { getElementById: id => nodes[id], body: { style: {} }, addEventListener: (name, callback) => { listeners[name] = callback; } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (options.method === 'POST') return { ok: true, json: async () => ({ url: 'https://checkout.example/mock' }) };
      return { ok: quote !== null, json: async () => quote };
    },
  });
  listeners.DOMContentLoaded();
  return { nodes, requests, open: () => window.CRCheckout.open({ fid: '123', businessId: '12345678', companyName: 'Example' }), submit: () => listeners['orderConfirmSubmit:click'](), window };
}

test('confirmation blocks checkout until the actual Stripe price is loaded', async () => {
  const result = run({ reportType: 'dk_ai_credit_risk', unitAmount: 750, currency: 'eur' });
  result.open();
  assert.equal(result.nodes.orderConfirmSubmit.disabled, true);
  result.submit();
  assert.equal(result.requests.length, 1);
  await flush();
  assert.equal(result.nodes.orderConfirmPrice.textContent, '€7.50');
  assert.equal(result.nodes.orderConfirmSubmit.disabled, false);
  result.submit();
  await flush();
  assert.equal(result.requests.length, 2);
  const payload = JSON.parse(result.requests[1].options.body);
  assert.equal(payload.reportType, 'dk_ai_credit_risk');
  assert.equal(payload.reportLang, 'en');
  assert.equal(payload.cancelPath, '/en/ai-credit-report/order/');
  assert.equal(result.window.location.href, 'https://checkout.example/mock');
});

test('failed or invalid price lookup keeps payment blocked with a recovery message', async () => {
  for (const quote of [null, { reportType: 'other', unitAmount: 300, currency: 'eur' }, { reportType: 'dk_ai_credit_risk', unitAmount: 0, currency: 'eur' }]) {
    const result = run(quote);
    result.open();
    await flush();
    assert.equal(result.nodes.orderConfirmSubmit.disabled, true);
    assert.match(result.nodes.orderConfirmError.textContent, /select the company again/);
    result.submit();
    assert.equal(result.requests.length, 1);
  }
});
