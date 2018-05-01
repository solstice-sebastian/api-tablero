const BinanceAccountInfo = require('./account-info.js');
const BinanceTickerBook = require('./ticker-book.js');
const BinanceAdapter = require('./adapter.js');
const BinanceOrderBook = require('./order-book.js');
const { getDefaults } = require('./helpers.js')();
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
  constructor(base = 'BTC') {
    this.base = base;
    this.adapter = new BinanceAdapter();
  }

  async fetch() {
    const { balanceBook } = await new BinanceAccountInfo(this.adapter).load();
    const tickerBook = await this.getTickerBook();
    const activeBalanceAssets = balanceBook.getActiveAssets(tickerBook);
    try {
      const orderBook = await this.getOrderBookForActiveAssets({
        activeBalanceAssets,
        limit: 10,
      });
      const assets = this.build({ orderBook, activeBalanceAssets, tickerBook });
      return Promise.resolve(this.serialize(assets));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @param {BinanceOrderBook} orderBook
   * @param {BinanceBalanceBook} balanceBook
   * @param {BinanceTickerBook} tickerBook
   * @return {Promise<Array<BinanceDashboardAsset>>}
   */
  build({ orderBook, activeBalanceAssets, tickerBook }) {
    const activeAssets = activeBalanceAssets.reduce((acc, asset) => {
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
      acc.push(
        new BinanceDashboardAsset({
          asset,
          lastBuyIn,
          currentPrice,
          currentProfitLoss,
          openOrders,
        })
      );
      return acc;
    }, []);

    if (activeAssets.length === 0) {
      return Constants.NO_DASHBOARD_ASSETS;
    }
    return activeAssets;
  }

  /**
   * get a ticker price
   */
  async getTickerBook() {
    this.tickerBook = await new BinanceTickerBook().load(this.adapter);
    return this.tickerBook;
  }

  /**
   * gets all open orders + latest `limit` orders for each activeAsset/base
   */
  async getOrderBookForActiveAssets({ activeBalanceAssets, limit }) {
    return new Promise(async (res, rej) => {
      // get openOrders
      const openOrders = await this.getOpenOrders();
      const activeAssetOrders = [];

      const runner = async (asset) => {
        if (asset === undefined) {
          const orderBook = new BinanceOrderBook([...openOrders, ...activeAssetOrders]);
          res(orderBook);
        } else {
          const { recvWindow, timestamp } = getDefaults();
          const symbol = `${asset}${this.base}`;
          const params = { symbol, recvWindow, timestamp, limit };
          const endpoint = endpoints.GET_ALL_ORDERS_FOR_SYMBOL;
          try {
            const orders = await this.adapter.get(endpoint, params);
            activeAssetOrders.push(...orders);
            const nextAsset = activeBalanceAssets.pop();
            runner(nextAsset);
          } catch (err) {
            rej(err);
          }
        }
      };
      // initiate runner
      const nextAsset = activeBalanceAssets.pop();
      runner(nextAsset);
    });
  }

  /**
   * @param {String=} symbol
   * @return {Promise}
   */
  async getOpenOrders() {
    const { recvWindow, timestamp } = getDefaults();
    const params = { recvWindow, timestamp };
    const endpoint = endpoints.GET_OPEN_ORDERS;
    const openOrders = await this.adapter.get(endpoint, params);
    return openOrders;
  }

  /**
   * @param {Array<BinanceDashboardAsset>} assets
   */
  serialize(assets) {
    const payload = {
      dashboard: {
        id: 1,
        'dashboard-assets': assets,
      },
    };
    return payload;
  }
}

module.exports = BinanceDashboard;
