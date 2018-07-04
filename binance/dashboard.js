const BinanceAccountInfo = require('./account-info.js');
const BinanceTickerBook = require('./ticker-book.js');
const BinanceAdapter = require('./adapter.js');
const BinanceOrderHistory = require('./order-history.js');
const { getDefaults } = require('./helpers')();
const Constants = require('@solstice.sebastian/constants');
const BinanceDashboardAsset = require('./dashboard-asset.js');

const { endpoints, orderSides } = Constants.binance;

/**
 * - active coins
 * - buy in price
 * - current price
 * - open order (if available) w/ PL
 */
class BinanceDashboard {
  constructor(base = 'BTC') {
    this.base = base;
    this.adapter = new BinanceAdapter();
    this.dashboardAssets = [];
  }

  async fetch() {
    const { balanceBook } = await new BinanceAccountInfo(this.adapter).load();
    const tickerBook = await this.getTickerBook();
    balanceBook.activeAssets = balanceBook.getActiveAssets(tickerBook);
    const orderHistory = await this.getOrderHistoryForAssets({
      assets: [...balanceBook.activeAssets],
      limit: 10,
    });
    this.dashboardAssets = this.build({ orderHistory, balanceBook, tickerBook });
    return Promise.resolve(this);
  }

  /**
   * @param {BinanceOrderHistory} orderHistory
   * @param {BinanceBalanceBook} balanceBook
   * @param {BinanceTickerBook} tickerBook
   * @return {Promise<Array<BinanceDashboardAsset>>}
   */
  build({ orderHistory, balanceBook, tickerBook }) {
    const activeAssets = balanceBook.activeAssets.reduce((acc, asset) => {
      const symbol = `${asset}${this.base}`;
      const lastBuyIn = orderHistory.getLastBuyIn(symbol);
      if (tickerBook.getSymbol(symbol) === undefined) {
        throw new Error(`BinanceDashboard missing ticker for symbol ${symbol}`);
      }
      const balance = balanceBook.getAsset(asset);
      const currentPrice = tickerBook.getSymbol(symbol).price;
      const openOrders = orderHistory.getOpen(symbol);
      acc.push(
        new BinanceDashboardAsset({
          lastBuyIn,
          currentPrice,
          openOrders,
          balance,
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
  async getOrderHistoryForAssets({ assets, limit }) {
    return new Promise(async (res, rej) => {
      const assetOrders = [];

      const runner = async (asset) => {
        if (asset === undefined) {
          const orderHistory = new BinanceOrderHistory([...assetOrders]);
          res(orderHistory);
        } else {
          const { recvWindow, timestamp } = getDefaults();
          const symbol = `${asset}${this.base}`;
          const params = { symbol, recvWindow, timestamp, limit };
          const endpoint = endpoints.GET_ALL_ORDERS_FOR_SYMBOL;
          try {
            const orders = await this.adapter.get(endpoint, params);
            assetOrders.push(...orders);
            const nextAsset = assets.pop();
            runner(nextAsset);
          } catch (err) {
            rej(err);
          }
        }
      };
      // initiate runner
      const nextAsset = assets.pop();
      runner(nextAsset);
    });
  }

  /**
   * @param {String=} symbol
   * @return {Promise}
   */
  async getOpenBuyOrders() {
    const { recvWindow, timestamp } = getDefaults();
    const params = { recvWindow, timestamp };
    const endpoint = endpoints.GET_OPEN_ORDERS;
    const openOrders = await this.adapter.get(endpoint, params);
    return openOrders.filter((order) => order.side === orderSides.BUY);
  }

  /**
   * @param {Array<BinanceDashboardAsset>} assets
   */
  serialize(assets = this.dashboardAssets) {
    const payload = {
      dashboard: {
        id: 1,
        'dashboard-assets': assets,
      },
    };
    return JSON.stringify(payload);
  }
}

module.exports = BinanceDashboard;
