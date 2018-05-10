const test = require('tape');
const SimpleMovingAverage = require('../modules/simple-moving-average.js');

test(`update`, (assert) => {
  const period = 3;
  const { update } = SimpleMovingAverage({ period });
  let values = update(2);
  assert.deepEqual(values, [2]);
  values = update(4);
  assert.deepEqual(values, [2, 4]);
  values = update(6);
  assert.deepEqual(values, [2, 4, 6]);
  values = update(8);
  assert.deepEqual(values, [4, 6, 8]);
  assert.end();
});

test(`calc`, (assert) => {
  const period = 3;
  const values = [2, 4, 6];
  const { calc, update } = SimpleMovingAverage({ period, values });
  assert.equal(calc(), 4);
  update(8);
  assert.equal(calc(), 6);
  assert.end();
});
