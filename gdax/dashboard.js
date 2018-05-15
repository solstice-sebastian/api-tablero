const { uniq } = require('lodash');
const GdaxAdapter = require('./adapter.js');
const GdaxDashboardAsset = require('./dashboard-asset.js');
const GdaxBalanceBook = require('./balance-book.js');
const GdaxOrderBook = require('./order-book.js');
const TickerBook = require('../coinigy/ticker-book.js');

class GdaxDashboard {
  constructor() {
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

    const tickerBook = new TickerBook();
    return Promise.resolve(
      this.build({
        balanceBook,
        orderBook,
        tickerBook,
      })
    );
  }

  /**
   * get lastBuyIn for each active balance
   */
  async build({ balanceBook, orderBook, tickerBook }) {
    const assetsWithBalance = balanceBook.getActiveAssets();
    const assetsWithOpenOrders = orderBook.getOpen().map((order) => order.getAsset());
    const activeAssets = uniq([...assetsWithBalance, ...assetsWithOpenOrders]);

    return activeAssets.map((activeAsset) => {
      const { asset, lastBuyIn, currentPrice, openOrders } = activeAsset;
      new GdaxDashboardAsset({
        asset,
        lastBuyIn,
        currentPrice,
        openOrders,
      });
    });
  }

  serialize() {
    const payload = {
      tickers: this.getList(),
    };
    return JSON.stringify(payload);
  }
}

module.exports = GdaxDashboard;
