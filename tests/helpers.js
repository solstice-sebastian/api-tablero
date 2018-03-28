const Helpers = require('../common/helpers.js');
const test = require('tape');

test(`modByPercent`, (assert) => {
  const { modByPercent } = Helpers();
  assert.equal(modByPercent(42, 0.02, 2), 42.84, 'should increase by percent');
  assert.equal(modByPercent(42, -0.02, 2), 41.16, 'should descrease by percent');
  const posFloat = 42.123432;
  assert.equal(modByPercent(posFloat, 0.02, 2), 42.97, 'should increase by percent');
  assert.equal(modByPercent(posFloat, -0.02, 2), 41.28, 'should descrease by percent');
  assert.end();
});

test(`getPercentDiff`, (assert) => {
  const { getPercentDiff } = Helpers();
  assert.equal(getPercentDiff(42, 42.84, 2), 0.02, 'should return percent increase as float');
  assert.equal(getPercentDiff(42, 41.28, 2), -0.02, 'should return percent descrease as float');
  assert.equal(getPercentDiff(0.00083, 0.00099, 2), 0.19, 'should work on fractions: increase');
  assert.equal(getPercentDiff(0.00099, 0.00083, 2), -0.16, 'should work on fractions: decrease');
  assert.end();
});

test(`nicePercent`, (assert) => {
  const { nicePercent } = Helpers();
  const p = 0.12345678;
  assert.equal(nicePercent(p), '12.35%', 'should default to 2 places and round');
  assert.equal(nicePercent(p, 0), '12%', 'should take places param');
  assert.equal(nicePercent(p, 3), '12.346%', 'should take places param');
  assert.end();
});
