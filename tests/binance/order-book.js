const test = require('tape');
const Constants = require('../../common/constants.js');
const BinanceOrderBook = require('../../binance/order-book.js');
const BinanceOrder = require('../../binance/order.js');
const Mocks = require('../../mocks/mocks.js');

const { orderStatuses } = Constants.binance;

test(`BinanceOrderBook`, (assert) => {
  const symbol = 'DASHBTC';
  const { orders } = Mocks();
  const orderBook = new BinanceOrderBook(orders);
  assert.equal(orderBook.getLastBuyIn(symbol).id, 4);
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

  const orderBook = new BinanceOrderBook(orders);
  const [open1, open2] = orderBook.getOpen();
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

  const orderBook = new BinanceOrderBook(orders);
  const openOrders = orderBook.getOpen(symbol);
  assert.equal(openOrders.length, 1);
  assert.equal(openOrders[0].id, 4);
  assert.end();
});
