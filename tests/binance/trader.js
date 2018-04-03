const test = require('tape');
const BinanceTrader = require('../../binance/trader.js');
const { getDefaults } = require('../../binance/helpers.js')();
const Constants = require('../../common/constants.js');

const { orderTypes, orderSides, endpoints } = Constants.binance;

const adapter = {
  get(endpoint, params) {
    return { endpoint, params };
  },

  post(endpoint, params) {
    return { endpoint, params };
  },
};

test(`postLimitOrder`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
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
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postLimitMakerOrder`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const price = 100;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postLimitMakerOrder({ symbol, quantity, price });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.price, price);
  assert.equal(actual.params.side, orderSides.BUY);
  assert.equal(actual.params.type, orderTypes.LIMIT_MAKER);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postStopLoss`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const stopPrice = 100;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postStopLoss({ symbol, quantity, stopPrice });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.stopPrice, stopPrice);
  assert.equal(actual.params.side, orderSides.BUY);
  assert.equal(actual.params.type, orderTypes.STOP_LOSS);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postTakeProfit`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const stopPrice = 100;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postTakeProfit({ symbol, quantity, stopPrice });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.stopPrice, stopPrice);
  assert.equal(actual.params.side, orderSides.SELL);
  assert.equal(actual.params.type, orderTypes.TAKE_PROFIT);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postStopLossLimit`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const stopPrice = 100;
  const price = 142;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postStopLossLimit({ symbol, quantity, stopPrice, price });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.stopPrice, stopPrice);
  assert.equal(actual.params.price, price);
  assert.equal(actual.params.side, orderSides.SELL);
  assert.equal(actual.params.type, orderTypes.STOP_LOSS_LIMIT);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postTakeProfitLimit`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const stopPrice = 100;
  const price = 84;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postTakeProfitLimit({ symbol, quantity, stopPrice, price });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.stopPrice, stopPrice);
  assert.equal(actual.params.price, price);
  assert.equal(actual.params.side, orderSides.SELL);
  assert.equal(actual.params.type, orderTypes.TAKE_PROFIT_LIMIT);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postMarket -- BUY`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const side = orderSides.BUY;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postMarket({ symbol, quantity, side });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.side, orderSides.BUY);
  assert.equal(actual.params.type, orderTypes.MARKET);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});

test(`postMarket -- SELL`, (assert) => {
  const { recvWindow, timestamp } = getDefaults();
  const symbol = 'ltcbtc';
  const quantity = 42;
  const side = orderSides.SELL;
  const trader = new BinanceTrader(adapter);
  const actual = trader.postMarket({ symbol, quantity, side });
  assert.equal(actual.params.symbol, symbol);
  assert.equal(actual.params.quantity, quantity);
  assert.equal(actual.params.side, orderSides.SELL);
  assert.equal(actual.params.type, orderTypes.MARKET);
  assert.equal(actual.endpoint, endpoints.POST_ORDER);
  assert.equal(actual.params.timeInForce, Constants.binance.timeInForce.GOOD_TIL_CANCELED);
  assert.equal(actual.params.recvWindow, recvWindow);
  assert.equal(actual.params.timestamp - timestamp >= 0, true);
  assert.end();
});
