const Constants = require('../common/constants.js');
const { getDefaults, safeJson } = require('./helpers.js')();
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

  async init(data) {
    return new Promise((res, rej) => {
      this.getOpenOrders()
        .then(safeJson)
        .then((orders) => {
          Object.assign(this, data, {
            balanceBook: new BinanceBalanceBook(data.balances),
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
    return this.adapter.get(endpoint, { timestamp }).then((balances) => this.init(balances));
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
