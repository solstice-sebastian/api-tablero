const Constants = require('@solstice.sebastian/constants');
const { modByPercent } = require('@solstice.sebastian/helpers')();
const { getDefaults } = require('./helpers.js')();

const { orderTypes, orderSides, endpoints } = Constants.binance;
/**
 * LIMIT: post an order to sell at `price`
 * LIMIT_MAKER: post an order to buy at `price` ???
 *
 * MARKET: buy/sell certain quantity
 *
 * STOP_LOSS: post market order when `price` < `stopPrice`
 * TAKE_PROFIT: post market order when `price` > `stopPrice`
 *
 * STOP_LOSS_LIMIT: post limit order when `price` < `stopPrice`
 * TAKE_PROFIT_LIMIT: post limit order when `price` > `stopPrice`
 *
 * @implements Trader
 */
class BinanceTrader {
  constructor(adapter) {
    this.adapter = adapter;
  }

  /**
   * LIMIT: post an order to sell at `price`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {price} price
   * @return {Promise}
   */
  postLimit({ symbol, quantity, price }) {
    const side = orderSides.SELL;
    const type = orderTypes.LIMIT;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, price, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * LIMIT_MAKER: post an order to buy at `price` ???
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {price} price
   * @return {Promise}
   */
  postLimitMaker({ symbol, quantity, price }) {
    const side = orderSides.BUY;
    const type = orderTypes.LIMIT_MAKER;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, price, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * STOP_LOSS: post market order when `price` < `stopPrice`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {Number} stopPrice
   * @return {Promise}
   */
  postStopLoss({ symbol, quantity, stopPrice }) {
    const side = orderSides.BUY;
    const type = orderTypes.STOP_LOSS;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, stopPrice, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * TAKE_PROFIT: post market order when `price` > `stopPrice`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {Number} stopPrice
   * @return {Promise}
   */
  postTakeProfit({ symbol, quantity, stopPrice }) {
    const side = orderSides.SELL;
    const type = orderTypes.TAKE_PROFIT;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, stopPrice, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * STOP_LOSS_LIMIT: post limit order when `price` < `stopPrice`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {Number} stopPrice
   * @param {Number} price
   * @return {Promise}
   */
  postStopLossLimit({ symbol, quantity, price, stopPrice }) {
    const side = orderSides.SELL;
    const type = orderTypes.STOP_LOSS_LIMIT;
    const endpoint = endpoints.POST_ORDER;
    const params = {
      symbol,
      quantity,
      side,
      type,
      price,
      stopPrice,
      ...getDefaults(),
    };
    return this.adapter.post(endpoint, params);
  }

  /**
   * TAKE_PROFIT_LIMIT: post limit order when `price` > `stopPrice`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {Number} stopPrice
   * @param {Number} price
   * @return {Promise}
   */
  postTakeProfitLimit({ symbol, quantity, price, stopPrice }) {
    const side = orderSides.SELL;
    const type = orderTypes.TAKE_PROFIT_LIMIT;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, price, stopPrice, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * MARKET: post market order to buy/sell at quantity
   *
   * @param {String} symbol
   * @param {String} side
   * @param {Number} quantity
   * @return {Promise}
   */
  postMarket({ symbol, quantity, side }) {
    const type = orderTypes.MARKET;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * handles canceling
   */
  updateStopLoss(openOrder, newLimit) {
    // make stop price slightly above target price
    const stopPrice = modByPercent(newLimit, Constants.STOP_LIMIT_BUFFER);
    const price = newLimit;
    const { symbol, quantity } = openOrder;
    return new Promise((res, rej) => {
      this.deleteOrder(openOrder.id)
        .then(() => {
          const promise = this.postStopLossLimit({ symbol, quantity, price, stopPrice });
          return res(promise);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }
}

module.exports = BinanceTrader;
