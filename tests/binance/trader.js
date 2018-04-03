const test = require('tape');
const BinanceTrader = require('../../binance/trader.js');
const {
  orderTypes,
  orderSides,
  endpoints,
  timeInForce,
} = require('../../common/constants.js').binance;

const adapter = {
  get(endpoint, params) {
    return { endpoint, params };
  },

  post(endpoint, params) {
    return { endpoint, params };
  },
};

test.only(`postLimitOrder`, (assert) => {
  const symbol = 'ltcbtc';
  const quantity = 42;
  const price = 100;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postLimitOrder({ symbol, quantity, price });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.price, price);
  assert.equal(actual.params.side, orderSides.SELL);
  assert.equal(actual.params.type, orderTypes.LIMIT);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, timeInForce.GOOD_TIL_CANCELED);
  assert.end();
});
