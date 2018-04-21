const test = require('tape');
const Constants = require('../../common/constants.js');
const BinanceOrderBook = require('../../binance/order-book.js');
const BinanceOrder = require('../../binance/order.js');

const { orderSides } = Constants.binance;

test(`BinanceOrderBook`, (assert) => {
  const symbol = 'DASHBTC';
  const orders = [
    new BinanceOrder({
      // sell
      id: 1,
      symbol,
      timestamp: 42,
      side: orderSides.SELL,
    }),
    new BinanceOrder({
      // old buy in
      id: 2,
      symbol,
      timestamp: 23,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // older buy in
      id: 3,
      symbol,
      timestamp: 12,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // latest buy in
      id: 4,
      symbol,
      timestamp: 48,
      side: orderSides.BUY,
    }),
    new BinanceOrder({
      // sell
      id: 5,
      symbol,
      timestamp: 77,
      side: orderSides.SELL,
    }),
  ];

  const orderBook = new BinanceOrderBook(orders);
  assert.equal(orderBook.getLastBuyIn(symbol).id, 4);
  assert.end();
});
