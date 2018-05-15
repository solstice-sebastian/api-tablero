const DashboardAsset = require('../models/dashboard-asset.js');

class BinanceDashboardAsset extends DashboardAsset {
  /**
   * @param {BinanceBalance} balance
   * @param {BinanceOrder} lastBuyIn
   * @param {Number} currentPrice
   * @param {Array<BinanceOrder>} openOrders
   */
  constructor({ balance, lastBuyIn, currentPrice, openOrders }) {
    const { asset } = balance;
    super({ asset, lastBuyIn, currentPrice, openOrders, balance });
  }
}

module.exports = BinanceDashboardAsset;
