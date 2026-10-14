const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = readFileSync(path.join(__dirname, '../js/search.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('  function normalizeCvr('), source.indexOf('  function orderConcernCompanies(')) + source.slice(source.indexOf('  function formatCompanyCode('), source.indexOf('  function buildCompanyUrl(')), context);

test('all supported CVR forms search the same eight-digit identifier', () => {
  for (const input of ['42132217', '42 13 22 17', '4213221-7', 'DK42132217', 'DK 42 13 22 17', 'CVR: 42132217', 'CVR-nummer: 4213221-7']) {
    assert.equal(context.buildSearchQuery(input), encodeURIComponent('42132217*|42132217'), input);
  }
  assert.equal(context.formatCompanyCode('4213221-7K'), '42132217');
  assert.equal(context.buildSearchQuery('Klena Holding ApS'), encodeURIComponent('Klena Holding ApS*|Klena Holding ApS'));
  assert.equal(context.normalizeCvr('1234567'), '1234567');
  assert.equal(context.normalizeCvr('FI12345678'), 'FI12345678');
  assert.equal(context.normalizeCvr('01234567'), '01234567');
});
