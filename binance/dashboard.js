const fetch = require('node-fetch');
const BinanceAccountInfo = require('./account-info.js');
const Constants = require('../common/constants.js');
const { getPercentDiff } = require('../common/helpers.js')();

const { endpoints } = Constants.binance;
/**
 * - active coins
 * - buy in price
 * - current price
 * - current PL (from buy in)
 * - open order (if available) w/ PL
 */
class BinanceDashboard {
  async update() {
    const info = await BinanceAccountInfo.load();
    return this.build(info);
  }

  /**
   * @param {BinanceOrderBook} orderBook
   * @param {BinanceBalanceBook} balanceBook
   */
  async build({ orderBook, balanceBook }) {
    await this.getTickers();
    const activeAssets = balanceBook.getActive();
    const data = activeAssets.reduce((acc, asset) => {
      const lastBuyIn = orderBook.getLastBuyIn(asset);
      const currentPrice = this.getPrice(asset);
      const currentProfitLoss = getPercentDiff(lastBuyIn, currentPrice);
      const openOrders = orderBook.getOpen(asset);
      acc[asset] = { asset, lastBuyIn, currentPrice, currentProfitLoss, openOrders };
      return acc;
    }, {});
    return Promise.Resolve(data);
  }

  getPrice(symbol) {
    if (symbol === undefined) {
      throw new Error('Dashboard#getPrice requires symbol');
    }
    if (this.tickers.length === 0) {
      throw new Error('Dashboard: no tickers');
    }
    return this.tickers[`BTC${symbol}`].price;
  }

  /**
   * get a ticker price
   */
  async getTickers() {
    const endpoint = endpoints.GET_TICKER;
    return new Promise((res, rej) => {
      fetch(endpoint)
        .then((tickers) => {
          this.tickers = tickers.reduce((acc, ticker) => {
            acc[ticker.symbol] = ticker;
            return acc;
          }, {});
          res(this.tickers);
        })
        .catch((err) => rej(err));
    });
  }
}

module.exports = BinanceDashboard;
