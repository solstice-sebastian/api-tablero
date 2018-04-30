const BinanceAccountInfo = require('./account-info.js');
const BinanceTickerBook = require('./ticker-book.js');
const Constants = require('../common/constants.js');
const { getPercentDiff } = require('../common/helpers.js')();

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
  constructor(base = 'BTC') {
    this.base = base;
  }

  async update() {
    const { orderBook, balanceBook } = await BinanceAccountInfo.load();
    const tickerBook = await this.getTickerBook();
    return Promise.Resolve(this.build({ orderBook, balanceBook, tickerBook }));
  }

  /**
   * @param {BinanceOrderBook} orderBook
   * @param {BinanceBalanceBook} balanceBook
   * @param {Promise<Array<BinanceDashboardAsset>>}
   */
  build({ orderBook, balanceBook, tickerBook }) {
    const activeAssets = balanceBook.getActive().map((item) => item.asset);
    if (activeAssets.length === 0) {
      return Constants.NO_DASHBOARD_ASSETS;
    }

    return activeAssets.reduce((acc, asset) => {
      const symbol = `${asset}${this.base}`;
      const lastBuyIn = orderBook.getLastBuyIn(symbol);
      if (tickerBook.getSymbol(symbol) === undefined) {
        throw new Error(`BinanceDashboard missing ticker for symbol ${symbol}`);
      }
      const currentPrice = tickerBook.getSymbol(symbol).price;
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
  async getTickerBook() {
    this.tickerBook = await new BinanceTickerBook().load();
    return this.tickerBook;
  }
}

module.exports = BinanceDashboard;
