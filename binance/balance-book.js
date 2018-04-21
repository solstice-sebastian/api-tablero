/**
 * handles the data structure returned by `getBalanceBook`
 */
const Constants = require('../common/constants.js');

class BinanceBalanceBook {
  /**
   * @param {Array<Object>=} balances
   */
  constructor(balances) {
    if (balances !== undefined) {
      this.init(balances);
    }
  }

  init(balances) {
    this.balances = balances
      .filter((coins) => +coins.free > 0 || +coins.locked > 0)
      .map(({ asset, free, locked }) => ({ asset, free: +free, locked: +locked }))
      .sort((a, b) => (+a.free < +b.free ? 1 : -1));
  }

  load(adapter) {
    const endpoint = Constants.binance.endpoints.GET_ACCOUNT_INFO;
    return adapter
      .get(endpoint)
      .then((response) => response.json())
      .then((data) => this.init(data.balances))
      .catch((err) => console.log(err));
  }

  /**
   * @param asset
   */
  getAsset(asset) {
    return this.balances.find((item) => item.asset === asset);
  }

  getBalance(asset) {
    return this.getAsset(asset).free;
  }

  getLocked() {
    return this.balances.filter((item) => item.locked >= 1);
  }

  getFree() {
    return this.balances.filter((item) => item.free >= 1);
  }

  getActive() {
    return this.balances.filter((item) => item.free >= 1 || item.locked >= 1);
  }

  log() {
    console.log('symbol | free | locked');
    this.balances.forEach((item) => {
      console.log(`${item.asset} -> ${item.free} | ${item.locked}`);
    });
  }
}

module.exports = BinanceBalanceBook;
