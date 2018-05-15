const OrderBook = require('../models/order-book.js');

class BinanceOrderBook extends OrderBook {
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('BinanceOrderBook requires Array<BinanceOrder>');
    }
    super(orders);
  }
}

module.exports = BinanceOrderBook;
