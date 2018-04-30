const Constants = require('../common/constants.js');
const { getDefaults } = require('./helpers.js')();
const BinanceBalanceBook = require('./balance-book.js');
const BinanceOrderBook = require('./order-book.js');

const { endpoints } = Constants.binance;

class BinanceAccountInfo {
  constructor(adapter) {
    if (adapter === undefined) {
      throw new Error('BinanceAccountInfo requires an adapter');
    }
    this.adapter = adapter;
  }

  /**
   * @param {Object} accountInfo
   */
  async init(accountInfo) {
    return new Promise((res, rej) => {
      this.getOpenOrders()
        .then((orders) => orders.json())
        .then((orders) => {
          Object.assign(this, accountInfo, {
            balanceBook: new BinanceBalanceBook(accountInfo.balances),
            orderBook: new BinanceOrderBook(orders),
          });
          res(this);
        })
        .catch((err) => {
          console.log(`err:`, err);
          rej(err);
        });
    });
  }

  /**
   * includes current balances
   */
  async load() {
    const timestamp = Date.now();
    const endpoint = endpoints.GET_ACCOUNT_INFO;
    return new Promise((res, rej) => {
      this.adapter
        .get(endpoint, { timestamp })
        .then((response) => response.json())
        .then((accountInfo) => {
          res(this.init(accountInfo));
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  /**
   * @param {String=} symbol
   * @return {Promise}
   */
  async getOpenOrders({ symbol } = {}) {
    const { recvWindow, timestamp } = getDefaults();
    const params = { symbol, recvWindow, timestamp };
    const endpoint = endpoints.GET_OPEN_ORDERS;
    return this.adapter.get(endpoint, params);
  }
}

module.exports = BinanceAccountInfo;
