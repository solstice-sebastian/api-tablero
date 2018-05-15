const OrderHistory = require('../models/order-history.js');
const GdaxOrder = require('./order.js');

class GdaxOrderHistory extends OrderHistory {
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('GdaxOrderHistory requires Array<GdaxOrder>');
    }
    const gdaxOrders = orders.map((order) => new GdaxOrder(order));
    super(gdaxOrders);
  }
}

module.exports = GdaxOrderHistory;
