const BalanceBook = require('../models/balance-book');
const GdaxBalance = require('./balance.js');

class GdaxBalanceBook extends BalanceBook {
  constructor(balances) {
    if (Array.isArray(balances) === false) {
      throw new Error('BinanceBalanceBook requires Array<BinanceBalance>');
    }
    super(balances);
  }

  /**
   * @param {Array<GdaxBalance>} balances
   */
  init(balances) {
    this.balances = balances.map((balance) => new GdaxBalance(balance));
  }

  /**
   * @return {Array<GdaxBalance>}
   */
  getActive() {
    return this.balances.filter((balance) => balance.isActive());
  }

  /**
   * @return {Array<String>}
   */
  getActiveAssets() {
    return this.getActive()
      .filter((balance) => balance.asset !== 'BTC')
      .map((balance) => balance.asset);
  }
}

module.exports = GdaxBalanceBook;
