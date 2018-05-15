const OrderBook = require('../models/order-book.js');

class GdaxOrderBook extends OrderBook {
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('GdaxOrderBook requires Array<GdaxOrder>');
    }
    super(orders);
  }
}

module.exports = GdaxOrderBook;
