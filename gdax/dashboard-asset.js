const DashboardAsset = require('../models/dashboard-asset.js');

class GdaxDashboardAsset extends DashboardAsset {
  /**
   * @param {String} asset
   * @param {GdaxBalance} balance
   * @param {GdaxOrder} lastBuyIn
   * @param {Number} currentPrice
   * @param {Array<GdaxOrder>} openOrders
   */
  constructor({ asset, lastBuyIn, currentPrice, openOrders, balance }) {
    super({ asset, lastBuyIn, currentPrice, openOrders, balance });
  }
}

module.exports = GdaxDashboardAsset;
