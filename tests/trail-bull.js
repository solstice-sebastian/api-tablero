const test = require('tape');
const TrailBull = require('../modules/trail-bull.js');
const { modByPercent } = require('../common/helpers.js')();

test(`TrailBull: valid data`, (assert) => {
  let actionCalled = false;
  const action = () => {
    actionCalled = true;
  };
  let lastPrice = 0.0042;
  let result;
  const buffer = -0.02;
  const limitPrice = modByPercent(lastPrice, buffer); // 0.004116
  const startTicker = { lastPrice };
  const { update } = TrailBull({ startTicker, buffer, action });

  lastPrice -= 0.00001; // price decreases
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, 'should NOT update limit price');
  assert.equal(result.shouldContinue, true, 'should continue');

  lastPrice += 0.02; // price increases
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, modByPercent(lastPrice, buffer), 'should update limit price');
  assert.equal(result.shouldContinue, true, 'should continue');

  lastPrice = result.limitPrice - 0.002; // drops below limit
  result = update({ ticker: { lastPrice } });
  assert.equal(result.shouldContinue, false, 'should exit trade');
  assert.equal(actionCalled, true, 'should call action');

  assert.end();
});

test(`TrailBull: invalid data`, (assert) => {
  const startingLastPrice = 0.0042;
  let lastPrice = Number.NaN; // bad data
  let result;
  const buffer = -0.02;
  const limitPrice = modByPercent(startingLastPrice, buffer); // 0.004116
  const startTicker = { lastPrice: startingLastPrice };
  const { update } = TrailBull({ startTicker, buffer, action: () => {} });

  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, `'${lastPrice}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${lastPrice}' should continue`);

  lastPrice = 0;
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, `'${lastPrice}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${lastPrice}' should continue`);

  lastPrice = 'abc';
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, `'${lastPrice}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${lastPrice}' should continue`);

  lastPrice = false;
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, `'${lastPrice}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${lastPrice}' should continue`);

  lastPrice = null;
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, `'${lastPrice}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${lastPrice}' should continue`);

  lastPrice = undefined;
  result = update({ ticker: { lastPrice } });
  assert.equal(result.limitPrice, limitPrice, `'${lastPrice}' should NOT update limitPrice`);
  assert.equal(result.shouldContinue, true, `'${lastPrice}' should continue`);

  lastPrice = -42;
  result = update({ ticker: { lastPrice } });
  assert.equal(
    result.limitPrice,
    limitPrice,
    `'${lastPrice}' (negative) should NOT update limitPrice`
  );
  assert.equal(result.shouldContinue, true, `'${lastPrice}' (negative) should continue`);

  assert.end();
});
