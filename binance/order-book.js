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

  /**
   * @param {String} symbol ASSETBASE
   * @return {BinanceOrder}
   */
  getLastBuyIn(symbol) {
    if (Array.isArray(this.orders) === false) {
      throw new Error(`OrderBook#getLastBuyIn: orders not initialized`);
    }
    const ordersForSymbol = this.filterBySymbol(symbol);
    const lastBuyIn = ordersForSymbol.reduce((prev, curr) => {
      if (curr.isFilled() === true && curr.side === orderSides.BUY) {
        if (prev.timestamp === undefined || curr.timestamp > prev.timestamp) {
          return curr;
        }
        return prev;
      }
      return prev;
    }, {});

    if (lastBuyIn.constructor !== BinanceOrder) {
      return Constants.NO_ORDER;
    }
    return lastBuyIn;
  }

  log() {
    console.log('symbol | price | qty | status');
    this.orders.forEach((order) => order.log());
  }
}

module.exports = BinanceOrderBook;
