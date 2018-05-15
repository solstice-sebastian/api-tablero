const Constants = require('../common/constants.js');
const BalanceBook = require('../models/balance-book.js');
const BinanceBalance = require('./balance.js');

class BinanceBalanceBook extends BalanceBook {
  /**
   * @param {Array<BinanceBalance>=}
   */
  constructor(balances) {
    if (Array.isArray(balances) === false) {
      throw new Error('BinanceBalanceBook requires Array<BinanceBalance>');
    }
    super(balances);
  }

  /**
   * @param {Array<BinanceBalance>} balances
   */
  init(balances) {
    this.balances = balances.map((balance) => new BinanceBalance(balance));
  }

  /**
   * hides the small assets
   * (balances valued less than 0.001 BTC)
   *
   * @param {BinanceTickerBook}
   * @return {Array<BinanceBalance>}
   */
  getActive(tickerBook) {
    if (tickerBook === undefined) {
      throw new Error(`BalanceBook#getActive requires a tickerBook`);
    }
    return this.balances.filter((item) => {
      const btcValue = tickerBook.getBtcPriceForAsset(item.asset) * item.qty;
      return btcValue > Constants.MIN_ASSET_BTC_VALUE;
    });
  }

  getActiveAssets(tickerBook) {
    return this.getActive(tickerBook).map((item) => item.asset);
  }
}

module.exports = BinanceBalanceBook;
