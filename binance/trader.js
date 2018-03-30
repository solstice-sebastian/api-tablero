const { orderTypes, orderSides, endpoints } = require('../common/constants.js').binance;
const BinanceBalanceBook = require('./balance-book.js');
const BinanceAdapter = require('./adapter');

const getDefaults = (overrides) =>
  Object.assign(
    {},
    {
      timestamp: Date.now(),
      timeInForce: 5000,
      recvWindow: 5000,
    },
    overrides
  );



/**
 * LIMIT: make a bid to sell at `price`
 * LIMIT_MAKER: make a bid to buy at `price` ???
 * MARKET: buy/sell certain quantity
 * STOP_LOSS: make market trade when `price` < `stopPrice`
 * STOP_LOSS_LIMIT: make limit bid when `price` < `stopPrice`
 * TAKE_PROFIT: make market trade when `price` > `stopPrice`
 * TAKE_PROFIT_LIMIT: make limit bid when `price` > `stopPrice`
 *
 * GET_ORDER
 * DELETE_ORDER
 *
 * @implements Trader
 */
class BinanceTrader {
  constructor() {
    this.adapter = new BinanceAdapter();
  }

  /**
   * LIMIT: make a bid to sell at `price`
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
   * LIMIT_MAKER: make a bid to buy at `price` ???
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {price} price
   * @return {Promise}
   */
  postLimitMakerOrder({ symbol, quantity, price }) {
    const side = orderSides.SELL;
    const type = orderTypes.LIMIT_MAKER;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, price, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * STOP_LOSS: make market trade when `price` < `stopPrice`
   *
   * @param {String} symbol
   * @param {Number} quantity
   * @param {price} price
   * @return {Promise}
   */
  postLimitMakerOrder({ symbol, quantity, stopPrice }) {
    const side = orderSides.SELL;
    const type = orderTypes.STOP_LOSS;
    const endpoint = endpoints.POST_ORDER;
    const params = { symbol, quantity, side, type, price, ...getDefaults() };
    return this.adapter.post(endpoint, params);
  }

  /**
   * @param {Number} timestamp
   * @param {String=} symbol
   * @param {Number=} recvWindow
   * @return {Promise}
   */
  getOpenOrders({ symbol }) {
    const params = {
      timestamp: Date.now(),
      symbol,
      recvWindow: this.recvWindow,
    };
    const endpoint = endpoints.GET_OPEN_ORDERS;
    return this.adapter.get(endpoint, params);
  }

  /**
   * @param {Number} timestamp
   * @param {Number=} recvWindow
   * includes current balances
   */
  getAccountInfo(timestamp = Date.now(), recvWindow = this.recvWindow) {
    const params = { timestamp, recvWindow };
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
