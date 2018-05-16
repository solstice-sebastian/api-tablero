const { uniq } = require('lodash');
const GdaxAdapter = require('./adapter.js');
const GdaxDashboardAsset = require('./dashboard-asset.js');
const GdaxBalanceBook = require('./balance-book.js');
const GdaxOrderHistory = require('./order-history.js');
const TickerBook = require('../coinigy/ticker-book.js');
const Constants = require('../common/constants.js');

class GdaxDashboard {
  constructor(base = 'USD') {
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
    const orderHistory = new GdaxOrderHistory(orders);

    const tickerBook = await new TickerBook().fetch();
    this.dashboardAssets = this.build({ balanceBook, orderHistory, tickerBook });
    return Promise.resolve(this);
  }

  /**
   * get lastBuyIn for each active balance
   */
  build({ balanceBook, orderHistory, tickerBook }) {
    const assetsWithBalance = balanceBook.getActiveAssets();
    const assetsWithOpenOrders = orderHistory.getOpen().map((order) => order.getAsset());
    const activeAssets = uniq([...assetsWithBalance, ...assetsWithOpenOrders]);

    return activeAssets.map((asset) => {
      const balance = balanceBook.getAsset(asset);

      const symbol = `${asset}${this.base}`;
      const openOrders = orderHistory.getOpen(symbol);
      const lastBuyIn = orderHistory.getLastBuyIn(symbol);
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
