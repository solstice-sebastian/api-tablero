const test = require('tape');
const Constants = require('../../common/constants.js');
const BinanceOrderHistory = require('../../binance/order-history.js');
const BinanceOrder = require('../../binance/order.js');
const Mocks = require('../../mocks/mocks.js');

const { orderStatuses } = Constants.binance;

test(`BinanceOrderHistory`, (assert) => {
  const symbol = 'DASHBTC';
  const { orders } = Mocks();
  const orderHistory = new BinanceOrderHistory(orders);
  assert.equal(orderHistory.getLastBuyIn(symbol).id, 4);
  assert.end();
});

test(`getOpen`, (assert) => {
  const symbol = 'DASHBTC';
  const orders = [
    new BinanceOrder({
      id: 1,
      status: orderStatuses.FILLED,
      symbol,
    }),
    new BinanceOrder({
      id: 42,
      status: orderStatuses.NEW,
      symbol: 'LTCBTC',
    }),
    new BinanceOrder({
      id: 4,
      status: orderStatuses.PARTIALLY_FILLED,
      symbol,
    }),
  ];

  const orderHistory = new BinanceOrderHistory(orders);
  const [open1, open2] = orderHistory.getOpen();
  assert.equal(open1.id, 42);
  assert.equal(open2.id, 4);
  assert.end();
});

test(`getOpen(symbol)`, (assert) => {
  const symbol = 'DASHBTC';
  const orders = [
    new BinanceOrder({
      id: 1,
      status: orderStatuses.FILLED,
      symbol,
    }),
    new BinanceOrder({
      id: 42,
      status: orderStatuses.NEW,
      symbol: 'LTCBTC',
    }),
    new BinanceOrder({
      id: 4,
      status: orderStatuses.PARTIALLY_FILLED,
      symbol,
    }),
  ];

  const orderHistory = new BinanceOrderHistory(orders);
  const openOrders = orderHistory.getOpen(symbol);
  assert.equal(openOrders.length, 1);
  assert.equal(openOrders[0].id, 4);
  assert.end();
});
