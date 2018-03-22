const test = require('tape');
const Result = require('../models/result.js');
const Constants = require('../common/constants.js');

test(`valid ticker`, (assert) => {
  const ticker = { lastPrice: 42 };
  const result = new Result({ ticker });
  assert.deepEqual(result.getTicker(), ticker, 'should return ticker');
  assert.equal(result.getLastPrice(), 42, 'should return correct lastPrice');
  assert.equal(result.getLimitPrice(), Constants.NO_LIMIT_PRICE, 'should return NO_LIMIT_PRICE');
  assert.end();
});

test(`null ticker`, (assert) => {
  const ticker = null;
  const result = new Result({ ticker });
  assert.deepEqual(result.getTicker(), Constants.NO_TICKER, 'should return NO_TICKER');
  assert.equal(
    result.getLastPrice(),
    Constants.NO_LAST_PRICE,
    'should return NO_LAST_PRICE for lastPrice'
  );
  assert.equal(
    result.getLimitPrice(),
    Constants.NO_LIMIT_PRICE,
    'should return NO_LIMIT_PRICE for limitPrice'
  );
  assert.end();
});

test(`undefined ticker`, (assert) => {
  const ticker = undefined;
  const result = new Result({ ticker });
  assert.deepEqual(result.getTicker(), Constants.NO_TICKER, 'should return NO_TICKER');
  assert.equal(
    result.getLastPrice(),
    Constants.NO_LAST_PRICE,
    'should return NO_LAST_PRICE for lastPrice'
  );
  assert.equal(
    result.getLimitPrice(),
    Constants.NO_LIMIT_PRICE,
    'should return NO_LIMIT_PRICE for limitPrice'
  );
  assert.end();
});

test(`valid limitPrice`, (assert) => {
  const lastPrice = 42;
  const ticker = { lastPrice };
  const limitPrice = 42.84;
  const result = new Result({ ticker, limitPrice });
  assert.deepEqual(result.getTicker(), ticker, 'should return ticker');
  assert.equal(result.getLastPrice(), lastPrice, 'should return lastPrice');
  assert.equal(result.getLimitPrice(), limitPrice, 'should return limitPrice');
  assert.end();
});

test(`invalid limitPrice`, (assert) => {
  const lastPrice = 42;
  const ticker = { lastPrice };
  const limitPrice = undefined;
  const result = new Result({ ticker, limitPrice });
  assert.deepEqual(result.getTicker(), ticker, 'should return ticker');
  assert.equal(result.getLastPrice(), lastPrice, 'should return lastPrice');
  assert.equal(result.getLimitPrice(), Constants.NO_LIMIT_PRICE, 'should return NO_LIMIT_PRICE');

  const NaNLimitPrice = Number.NaN;
  const NaNResult = new Result({ ticker, NaNLimitPrice });
  assert.deepEqual(NaNResult.getTicker(), ticker, 'should return ticker');
  assert.equal(NaNResult.getLastPrice(), lastPrice, 'should return lastPrice');
  assert.equal(NaNResult.getLimitPrice(), Constants.NO_LIMIT_PRICE, 'should return NO_LIMIT_PRICE');
  assert.end();
});
