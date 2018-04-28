const fetch = require('node-fetch');
const BinanceAccountInfo = require('./account-info.js');
const Constants = require('../common/constants.js');
const { getPercentDiff } = require('../common/helpers.js')();

const { endpoints } = Constants.binance;

class BinanceDashboardAsset {
  /**
   * @param {String} asset
   * @param {BinanceOrder} lastBuyIn
   * @param {Number} currentPrice
   * @param {Number} currentProfitLoss
   * @param {Array<BinanceOrder>} openOrders
   */
  constructor({ asset, lastBuyIn, currentPrice, currentProfitLoss, openOrders }) {
    this.asset = asset;
    this.lastBuyIn = lastBuyIn;
    this.currentPrice = currentPrice;
    this.currentProfitLoss = currentProfitLoss;
    this.openOrders = openOrders;
  }
}

/**
 * - active coins
 * - buy in price
 * - current price
 * - current PL (from buy in)
 * - open order (if available) w/ PL
 */
class BinanceDashboard {
  constructor({ base = 'BTC' } = {}) {
    this.base = base;
  }

  async update() {
    const { orderBook, balanceBook } = await BinanceAccountInfo.load();
    const indexedTickers = await this.getTickers();
    return Promise.Resolve(this.build({ orderBook, balanceBook, indexedTickers }));
  }

  /**
   * @param {BinanceOrderBook} orderBook
   * @param {BinanceBalanceBook} balanceBook
   * @param {Promise<Array<BinanceDashboardAsset>>}
   */
  build({ orderBook, balanceBook, indexedTickers }) {
    const activeAssets = balanceBook.getActive().map((item) => item.asset);
    if (activeAssets.length === 0) {
      return Constants.NO_DASHBOARD_ASSETS;
    }

    return activeAssets.reduce((acc, asset) => {
      const symbol = `${asset}${this.base}`;
      const lastBuyIn = orderBook.getLastBuyIn(symbol);
      if (indexedTickers[symbol] === undefined) {
        throw new Error(`BinanceDashboard missing ticker for symbol ${symbol}`);
      }
      const currentPrice = indexedTickers[symbol].price;
      const currentProfitLoss = getPercentDiff(lastBuyIn.price, currentPrice);
      const openOrders = orderBook.getOpen(symbol).map((order) =>
        Object.assign({}, order, {
          lockedProfitLoss: getPercentDiff(lastBuyIn.price, order.price),
        })
      );
      acc[asset] = new BinanceDashboardAsset({
        asset,
        lastBuyIn,
        currentPrice,
        currentProfitLoss,
        openOrders,
      });
      return acc;
    }, {});
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
