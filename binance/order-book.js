const OrderBook = require('../models/order-book.js');
const BinanceOrder = require('./order.js');

class BinanceOrderBook extends OrderBook {
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('BinanceOrderBook requires Array<BinanceOrder>');
    }
    const binanceOrders = orders.map((order) => new BinanceOrder(order));
    super(binanceOrders);
  }
}

module.exports = BinanceOrderBook;
