/**
 * handles the data structure returned by `getBalanceBook`
 */
const Constants = require('../common/constants.js');

const largeAssets = ['DASH', 'ZEC', 'LTC', 'ETH'];

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
      .map(({ asset, free, locked }) => ({
        asset,
        free: +free,
        locked: +locked,
        isLarge: largeAssets.includes(asset),
      }))
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
    return this.balances.filter((item) => item.locked > 0);
  }

  getFree() {
    return this.balances.filter((item) => {
      const threshold = item.isLarge ? 0.1 : 1;
      return item.free >= threshold;
    });
  }

  getActive() {
    const freeAssets = this.getFree().map((item) => item.asset);
    const lockedAssets = this.getLocked().map((item) => item.asset);
    return this.balances.filter(
      (item) => freeAssets.includes(item.asset) || lockedAssets.includes(item.asset)
    );
  }

  log() {
    console.log('asset | free | locked');
    this.balances.forEach((item) => {
      console.log(`${item.asset} -> ${item.free} | ${item.locked}`);
    });
  }
}

module.exports = BinanceBalanceBook;
