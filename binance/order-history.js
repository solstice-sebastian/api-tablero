const OrderHistory = require('../models/order-history.js');
const BinanceOrder = require('./order.js');

class BinanceOrderHistory extends OrderHistory {
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('BinanceOrderHistory requires Array<BinanceOrder>');
    }
    const binanceOrders = orders.map((order) => new BinanceOrder(order));
    super(binanceOrders);
  }
}

module.exports = BinanceOrderHistory;
