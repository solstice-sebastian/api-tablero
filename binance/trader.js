const {
  orderTypes,
  orderSides,
  endpoints,
  timeInForce,
} = require('../common/constants.js').binance;
const BinanceBalanceBook = require('./balance-book.js');
const BinanceAdapter = require('./adapter');

const getDefaults = (overrides) =>
  Object.assign(
    {},
    {
      timestamp: Date.now(),
      timeInForce: timeInForce.GOOD_TIL_CANCELED,
      recvWindow: 2500,
    },
    overrides
  );

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
  constructor() {
    this.adapter = new BinanceAdapter();
  }

  /**
   * LIMIT: post an order to sell at `price`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {price} price
   * @return {Promise}
   */
  postLimitOrder({ symbol, quantity, price }) {
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
  postLimitMakerOrder({ symbol, quantity, price }) {
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
    const params = { symbol, quantity, side, type, price, stopPrice, ...getDefaults() };
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
   * @param {String=} symbol
   * @return {Promise}
   */
  getOpenOrders({ symbol }) {
    const params = { symbol, ...getDefaults() };
    const endpoint = endpoints.GET_OPEN_ORDERS;
    return this.adapter.get(endpoint, params);
  }

  /**
   * includes current balances
   */
  getAccountInfo() {
    const params = getDefaults();
    const endpoint = endpoints.GET_ACCOUNT_INFO;
    return this.adapter.get(endpoint, params);
  }

  /**
   * helper method to parse account info into a BinanceBalanceBook
   */
  getBalances() {
    return new Promise((res, rej) => {
      this.getAccountInfo()
        .then((response) => response.json())
        .then((data) => new BinanceBalanceBook(data.balances))
        .then((binanceBalanceBook) => {
          binanceBalanceBook.log();
          return res(binanceBalanceBook);
        })
        .catch((err) => rej(err));
    });
  }
}

module.exports = BinanceTrader;
