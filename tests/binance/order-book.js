const test = require('tape');
const Constants = require('../../common/constants.js');
const BinanceOrderBook = require('../../binance/order-book.js');
const BinanceOrder = require('../../binance/order.js');

const { orderSides, statuses } = Constants.binance;

test(`BinanceOrderBook`, (assert) => {
  const symbol = 'DASHBTC';
  const orders = [
    new BinanceOrder({
      // sell
      id: 1,
      status: statuses.order.FILLED,
      symbol,
      timestamp: 42,
      side: orderSides.SELL,
    }),
    new BinanceOrder({
      // old buy in
      id: 2,
      status: statuses.order.FILLED,
      symbol,
      timestamp: 23,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // older buy in
      id: 3,
      status: statuses.order.FILLED,
      symbol,
      timestamp: 12,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // latest buy in
      id: 4,
      status: statuses.order.FILLED,
      symbol,
      timestamp: 48,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // sell
      id: 5,
      status: statuses.order.FILLED,
      symbol,
      timestamp: 77,
      side: orderSides.SELL,
    }),
    new BinanceOrder({
      // isOpen
      id: 6,
      status: statuses.order.NEW,
      symbol,
      timestamp: 48 * 2,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // isOpen
      id: 7,
      status: statuses.order.PARTIALLY_FILLED,
      symbol,
      timestamp: 48 * 4,
      side: orderSides.BUY,
    }),
  ];

  const orderBook = new BinanceOrderBook(orders);
  assert.equal(orderBook.getLastBuyIn(symbol).id, 4);
  assert.end();
});
