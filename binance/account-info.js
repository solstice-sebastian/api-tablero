const Constants = require('@solstice.sebastian/constants');
const BinanceBalanceBook = require('./balance-book.js');

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
    Object.assign(this, accountInfo, {
      balanceBook: new BinanceBalanceBook(accountInfo.balances),
    });
    return Promise.resolve(this);
  }

  /**
   * includes current balances
   */
  async load() {
    const timestamp = Date.now();
    const endpoint = endpoints.GET_ACCOUNT_INFO;
    return new Promise((res, rej) => {
      this.adapter
        .get(endpoint, { timestamp, recvWindow: 1000 * 60 })
        .then((accountInfo) => {
          res(this.init(accountInfo));
        })
        .catch((err) => {
          rej(err);
        });
    });
  }
}

module.exports = BinanceAccountInfo;
