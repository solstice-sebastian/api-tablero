const Constants = require('../common/constants.js');
// const { getDefaults } = require('./helpers.js')();
const BinanceOrder = require('./order.js');

const { orderSides } = Constants.binance;

class BinanceOrderBook {
  /**
   * @param {Array<Object>=} orders
   */
  constructor(orders) {
    if (orders !== undefined) {
      this.init(orders);
    }
  }

  init(orders) {
    this.orders = orders.map((order) => new BinanceOrder(order));
  }

  load(adapter) {
    const endpoint = Constants.binance.endpoints.GET_ALL_ORDERS;
    return adapter
      .get(endpoint)
      .then((response) => response.json())
      .then((data) => this.init(data.orders))
      .catch((err) => console.log(err));
  }

  /**
   * @param symbol
   */
  filterBySymbol(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderBook#filterBySymbol: orders not initialized`);
    }
    return this.orders.filter((order) => order.symbol === symbol);
  }

  /**
   * @param {Number} orderId
   */
  findById(orderId) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderBook#findById: orders not initialized`);
    }
    return this.orders.find((order) => order.id === orderId);
  }

  getOpen(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderBook#getOpen: orders not initialized`);
    }

    if (symbol === undefined) {
      return this.orders.filter((order) => order.isOpen() === true);
    }
    return this.orders.filter((order) => order.isOpen() === true && order.symbol === symbol);
  }

  getLastBuyIn(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderBook#getLastBuyIn: orders not initialized`);
    }
    const ordersForSymbol = this.filterBySymbol(symbol);
    return ordersForSymbol.reduce((prev, curr) => {
      if (curr.isOpen() === false && curr.side === orderSides.BUY) {
        if (prev.timestamp === undefined || curr.timestamp > prev.timestamp) {
          return curr;
        }
        return prev;
      }
      return prev;
    }, {});
  }

  log() {
    console.log('symbol | price | qty | status');
    this.orders.forEach((order) => order.log());
  }
}

module.exports = BinanceOrderBook;
