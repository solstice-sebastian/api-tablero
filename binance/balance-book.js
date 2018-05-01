const Constants = require('../common/constants.js');
const BinanceBalance = require('./balance.js');

class BinanceBalanceBook {
  /**
   * @param {Array<BinanceBalance>=}
   */
  constructor(balances) {
    if (balances !== undefined) {
      this.init(balances);
    }
  }

  init(balances) {
    this.balances = balances.map((data) => new BinanceBalance(data));
  }

  load(adapter) {
    const endpoint = Constants.binance.endpoints.GET_ACCOUNT_INFO;
    return adapter
      .get(endpoint)
      .then((data) => this.init(data.balances))
      .catch((err) => console.log(err));
  }

  /**
   * @param asset
   */
  getAsset(asset) {
    return this.balances.find((item) => item.asset === asset);
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

  log() {
    console.log('asset | qty | free | locked');
    this.balances.forEach((item) => {
      console.log(`${item.asset} -> ${item.qty} | ${item.free} | ${item.locked}`);
    });
  }
}

module.exports = BinanceBalanceBook;
