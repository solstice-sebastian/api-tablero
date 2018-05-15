const OrderBook = require('../models/order-book.js');
const GdaxOrder = require('./order.js');

class GdaxOrderBook extends OrderBook {
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('GdaxOrderBook requires Array<GdaxOrder>');
    }
    const gdaxOrders = orders.map((order) => new GdaxOrder(order));
    super(gdaxOrders);
  }
}

module.exports = GdaxOrderBook;
