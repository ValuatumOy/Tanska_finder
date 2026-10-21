const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/analytics.js'), 'utf8');
const helper = source.slice(source.indexOf('  function purchaseContext()'), source.indexOf('  function currentConsent()'));

function run({ consent = 'granted', client = '123.456', session = '789', blocked = false } = {}) {
  const timers = [], requests = [];
  const scope = {
    loaded: true, MEASUREMENT_ID: 'G-W3625Y8D4S', currentConsent: () => consent,
    window: {
      setTimeout: cb => timers.push(cb),
      gtag: (...args) => { requests.push(args.slice(0, 3)); if (!blocked) args[3](args[2] === 'client_id' ? client : session); },
    },
  };
  vm.createContext(scope);
  vm.runInContext(helper, scope);
  return { result: scope.purchaseContext(), timers, requests };
}

test('only consented real GA identifiers are attached to checkout', async () => {
  const { result } = run();
  const context = await result;
  assert.equal(context.clientId, '123.456');
  assert.equal(context.sessionId, '789');
  assert.equal(context.measurementId, 'G-W3625Y8D4S');
  assert.equal(context.consent, 'granted');
});

test('denied consent does not even request GA identifiers', async () => {
  const h = run({ consent: 'denied' });
  assert.equal(await h.result, null);
  assert.equal(h.requests.length, 0);
});

test('blocked analytics times out without blocking payment; malformed identifiers are excluded', async () => {
  const h = run({ blocked: true });
  h.timers[0]();
  assert.equal(await h.result, null);
  assert.equal(await run({ client: 'email@example.com' }).result, null);
});
