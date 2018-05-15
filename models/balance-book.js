class BalanceBook {
  /**
   * @param {Array<Balance>=}
   */
  constructor(balances, Ctor) {
    if (balances !== undefined) {
      this.init(balances, Ctor);
    }
  }

  /**
   * @override
   */
  init() {}

  /**
   * @override
   */
  getActive() {}

  /**
   * @override
   */
  getActiveAssets() {}

  /**
   * @param asset
   * @return {Balance} matching asset
   */
  getAsset(asset) {
    return this.balances.find((item) => item.asset === asset);
  }

  /**
   * @param {String} asset
   * @return {Number} combined free + locked
   */
  getQty(asset) {
    return this.getAsset(asset).qty;
  }

  toString() {
    console.log('asset | qty | free | locked');
    this.balances.forEach((balance) => balance.toString());
  }
}

module.exports = BalanceBook;
