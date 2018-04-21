const Constants = require('../common/constants.js');
const { getDefaults } = require('./helpers.js')();
const BinanceBalanceBook = require('./balance-book.js');
const BinanceOrderBook = require('./order-book.js');

const { endpoints } = Constants.binance;

class BinanceAccountInfo {
  constructor(adapter) {
    this.adapter = adapter;
  }

  init(data) {
    return new Promise((res, rej) => {
      this.getOpenOrders()
        .then((orders) => {
          const accountInfo = Object.assign(this, data, {
            balanceBook: new BinanceBalanceBook(data.balances),
            openOrders: new BinanceOrderBook(orders),
          });
          res(accountInfo);
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
  load() {
    const timestamp = Date.now();
    const endpoint = endpoints.GET_ACCOUNT_INFO;
    return this.adapter.get(endpoint, { timestamp }).then(this.init);
  }

  /**
   * @param {String=} symbol
   * @return {Promise}
   */
  getOpenOrders({ symbol } = {}) {
    const { recvWindow, timestamp } = getDefaults();
    const params = { symbol, recvWindow, timestamp };
    const endpoint = endpoints.GET_OPEN_ORDERS;
    return this.adapter.get(endpoint, params);
  }
}

module.exports = BinanceAccountInfo;
