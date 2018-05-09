/**
 * @implements Ticker
 *
 * @param {Number} price in asset price
 * @param {String} symbol in 'ASSETBASE'
 * @param {Number} timestamp in milliseconds
 * @param {Number} volume of asset
 * @param {Number} baseVolume of base
 */

/**
 * {
 *   "id": "BCH-BTC",
 *   "base_currency": "BCH",
 *   "quote_currency": "BTC",
 *   "base_min_size": "0.01",
 *   "base_max_size": "200",
 *   "quote_increment": "0.00001",
 *   "display_name": "BCH/BTC",
 *   "status": "online",
 *   "margin_enabled": false,
 *   "status_message": null,
 *   "min_market_funds": "0.001",
 *   "max_market_funds": "30",
 *   "post_only": false,
 *   "limit_only": false,
 *   "cancel_only": false
 * }
 */
class GdaxSymbolInfo {
  constructor(data) {
    this.baseMinSize = data.base_min_size;
    this.baseMaxSize = data.base_max_size;
    this.minStep = data.quote_increment;
  }
}

module.exports = GdaxSymbolInfo;
