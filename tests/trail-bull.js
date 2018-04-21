const test = require('tape');
const TrailBull = require('../modules/trail-bull.js');
const { modByPercent } = require('../common/helpers.js')();

test(`TrailBull: valid data`, (assert) => {
  let onChangeCount = 0;
  let onExitCalled = false;
  const onExit = () => {
    onExitCalled = true;
  };
  const onChange = () => {
    onChangeCount += 1;
  };
  let price = 0.0042;
  let result;
  const buffer = -0.02;
  const limitPrice = modByPercent(price, buffer); // 0.004116
  const startTicker = { price };
  const { update } = TrailBull({ startTicker, buffer, onExit, onChange });

  price -= 0.00001; // price decreases
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, 'should NOT update limit price');
  assert.equal(result.shouldContinue, true, 'should continue');

  price += 0.02; // price increases
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, modByPercent(price, buffer), 'should update limit price');
  assert.equal(result.shouldContinue, true, 'should continue');
  assert.equal(onChangeCount, 1, 'should call onChange');

  price = result.limitPrice - 0.002; // drops below limit
  result = update({ ticker: { price } });
  assert.equal(result.shouldContinue, false, 'should exit trade');
  assert.equal(onExitCalled, true, 'should call action');

  assert.end();
});

test(`TrailBull: invalid data`, (assert) => {
  const startingprice = 0.0042;
  let price = Number.NaN; // bad data
  let result;
  const buffer = -0.02;
  const limitPrice = modByPercent(startingprice, buffer); // 0.004116
  const startTicker = { price: startingprice };
  const { update } = TrailBull({ startTicker, buffer, action: () => {} });

  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' should continue`);

  price = 0;
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' should continue`);

  price = 'abc';
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' should continue`);

  price = false;
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' should continue`);

  price = null;
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' should continue`);

  price = undefined;
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' should continue`);

  price = -42;
  result = update({ ticker: { price } });
  assert.equal(result.limitPrice, limitPrice, `'${price}' (negative) should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${price}' (negative) should continue`);

  assert.end();
});
