/**
 * handles the data structure returned by `getBalanceBook`
 */
class BinanceBalanceBook {
  constructor(balances) {
    this.balances = balances
      .filter((coins) => +coins.free > 0 || +coins.locked > 0)
      .map(({ asset, free, locked }) => ({ asset, free: +free, locked: +locked }))
      .sort((a, b) => (+a.free < +b.free ? 1 : -1));
  }

  /**
   * @param asset
   */
  getAsset(asset) {
    return this.balances.find((item) => item.asset === asset);
  }

  getLocked() {
    return this.balances.filter((item) => item.locked > 0);
  }

  getFree() {
    return this.balances.filter((item) => item.free > 0);
  }

  log() {
    console.log('symbol | free | locked');
    this.balances.forEach((item) => {
      console.log(`${item.asset} -> ${item.free} | ${item.locked}`);
    });
  }
}

module.exports = BinanceBalanceBook;
