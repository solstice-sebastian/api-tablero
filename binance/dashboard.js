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
   * @param {BinanceBalance} balance
   * @param {BinanceOrder} lastBuyIn
   * @param {Number} currentPrice
   * @param {Number} currentProfitLoss
   * @param {Array<BinanceOrder>} openOrders
   */
  constructor({ balance, lastBuyIn, currentPrice, currentProfitLoss, openOrders }) {
    this.asset = balance.asset;
    this.lastBuyIn = lastBuyIn;
    this.currentPrice = currentPrice;
    this.currentProfitLoss = currentProfitLoss;
    this.openOrders = openOrders;
    this.balance = balance;
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
    balanceBook.activeAssets = balanceBook.getActiveAssets(tickerBook);
    const orderBook = await this.getOrderBookForAssets({
      assets: [...balanceBook.activeAssets],
      limit: 10,
    });
    const assets = this.build({ orderBook, balanceBook, tickerBook });
    return Promise.resolve(this.serialize(assets));
  }

  /**
   * @param {BinanceOrderBook} orderBook
   * @param {BinanceBalanceBook} balanceBook
   * @param {BinanceTickerBook} tickerBook
   * @return {Promise<Array<BinanceDashboardAsset>>}
   */
  build({ orderBook, balanceBook, tickerBook }) {
    const activeAssets = balanceBook.activeAssets.reduce((acc, asset) => {
      const symbol = `${asset}${this.base}`;
      const lastBuyIn = orderBook.getLastBuyIn(symbol);
      if (tickerBook.getSymbol(symbol) === undefined) {
        throw new Error(`BinanceDashboard missing ticker for symbol ${symbol}`);
      }
      const balance = balanceBook.getAsset(asset);
      const currentPrice = tickerBook.getSymbol(symbol).price;
      const currentProfitLoss = getPercentDiff(lastBuyIn.price, currentPrice);
      const openOrders = orderBook.getOpen(symbol).map((order) =>
        Object.assign({}, order, {
          lockedProfitLoss: getPercentDiff(lastBuyIn.price, order.price),
        })
      );
      acc.push(
        new BinanceDashboardAsset({
          lastBuyIn,
          currentPrice,
          currentProfitLoss,
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
  async getOrderBookForAssets({ assets, limit }) {
    return new Promise(async (res, rej) => {
      // get openOrders
      const openOrders = await this.getOpenOrders();
      const assetOrders = [];

      const runner = async (asset) => {
        if (asset === undefined) {
          const orderBook = new BinanceOrderBook([...openOrders, ...assetOrders]);
          res(orderBook);
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
