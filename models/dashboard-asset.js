class DashboardAsset {
  /**
   * @param {String} asset
   * @param {Order} lastBuyIn
   * @param {Number} currentPrice
   * @param {Array<Order>} openOrders
   * @param {Balance} balance
   */
  constructor({ asset, lastBuyIn, currentPrice, openOrders, balance }) {
    this.asset = asset;
    this.lastBuyIn = lastBuyIn;
    this.currentPrice = currentPrice;
    this.openOrders = openOrders;
    this.balance = balance;
  }
}

module.exports = DashboardAsset;
