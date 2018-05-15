const { uniq } = require('lodash');
const GdaxAdapter = require('./adapter.js');
const GdaxDashboardAsset = require('./dashboard-asset.js');
const GdaxBalanceBook = require('./balance-book.js');
const GdaxOrderBook = require('./order-book.js');
const TickerBook = require('../coinigy/ticker-book.js');
const Constants = require('../common/constants.js');

class GdaxDashboard {
  constructor(base = 'BTC') {
    this.base = base;
    this.adapter = new GdaxAdapter();
  }

  /**
   * create dashboard assets from open orders and assets with a balance
   * @return {Promise<Array<GdaxDashboardAsset>>}
   */
  async fetch() {
    const balances = await this.adapter.getBalances();
    const balanceBook = new GdaxBalanceBook(balances);

    const orders = await this.adapter.getOrders();
    const orderBook = new GdaxOrderBook(orders);

    const tickerBook = await new TickerBook().fetch();
    this.dashboardAssets = this.build({ balanceBook, orderBook, tickerBook });
    return Promise.resolve(this);
  }

  /**
   * get lastBuyIn for each active balance
   */
  build({ balanceBook, orderBook, tickerBook }) {
    const assetsWithBalance = balanceBook.getActiveAssets();
    const assetsWithOpenOrders = orderBook.getOpen().map((order) => order.getAsset());
    const activeAssets = uniq([...assetsWithBalance, ...assetsWithOpenOrders]);

    return activeAssets.map((asset) => {
      const openOrders = orderBook.getOpen(asset);
      const balance = balanceBook.getAsset(asset);

      const symbol = `${this.base}${asset}`;
      const lastBuyIn = orderBook.getLastBuyIn(symbol);
      const ticker = tickerBook.getTicker(symbol);
      const currentPrice = ticker !== undefined ? ticker.price : Constants.NO_TICKER;
      return new GdaxDashboardAsset({
        asset,
        lastBuyIn,
        currentPrice,
        openOrders,
        balance,
      });
    });
  }

  /**
   * @param {Array<GdaxDashboardAsset>} assets
   */
  serialize(assets = this.dashboardAssets) {
    const payload = {
      dashboard: {
        id: 2,
        'dashboard-assets': assets,
      },
    };
    return JSON.stringify(payload);
  }
}

module.exports = GdaxDashboard;
