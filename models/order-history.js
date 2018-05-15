class GdaxOrderHistory {
  /**
   * @param {Array<Order>} orders
   */
  constructor(orders) {
    if (Array.isArray(orders) === false) {
      throw new Error('OrderHistory requires an Array<Order>');
    }
    this.orders = orders;
  }

  /**
   * @param symbol
   */
  filterBySymbol(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderHistory#filterBySymbol: orders not initialized`);
    }
    return this.orders.filter((order) => order.symbol === symbol);
  }

  /**
   * @param {Number} orderId
   */
  findById(orderId) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderHistory#findById: orders not initialized`);
    }
    return this.orders.find((order) => order.id === orderId);
  }

  getOpen(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderHistory#getOpen: orders not initialized`);
    }

    if (symbol === undefined) {
      return this.orders.filter((order) => order.isOpen() === true);
    }
    return this.orders.filter((order) => order.isOpen() === true && order.symbol === symbol);
  }

  /**
   * @param {String} symbol ASSETBASE
   * @return {Order}
   */
  getLastBuyIn(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderHistory#getLastBuyIn: orders not initialized`);
    }
    const ordersForSymbol = this.filterBySymbol(symbol);
    const lastBuyIn = ordersForSymbol.reduce((prev, curr) => {
      if (curr.isFilled() === true && curr.isBuy() === true) {
        if (prev.timestamp === undefined || curr.timestamp > prev.timestamp) {
          return curr;
        }
        return prev;
      }
      return prev;
    }, {});

    return lastBuyIn;
  }

  toString() {
    console.log('symbol | price | qty | status');
    this.orders.forEach((order) => order.toString());
  }
}

module.exports = GdaxOrderHistory;
