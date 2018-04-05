/**
 * {
 *   "symbol": "ETHBTC",
 *   "status": "TRADING",
 *   "baseAsset": "ETH",
 *   "baseAssetPrecision": 8,
 *   "quoteAsset": "BTC",
 *   "quotePrecision": 8,
 *   "orderTypes": ["LIMIT", "MARKET"],
 *   "icebergAllowed": false,
 *   "filters": [{
 *     "filterType": "PRICE",
 *     "minPrice": "0.00000100",
 *     "maxPrice": "100000.00000000",
 *     "tickSize": "0.00000100"
 *   }, {
 *     "filterType": "LOT_SIZE",
 *     "minQty": "0.00100000",
 *     "maxQty": "100000.00000000",
 *     "stepSize": "0.00100000"
 *   }, {
 *     "filterType": "MIN_NOTIONAL",
 *     "minNotional": "0.00100000"
 *   }]
 * }
 */

const Constants = require('../common/constants.js');
const { castSatoshi } = require('../common/helpers.js')();

const { filterTypes } = Constants.binance;

class BinanceSymbolInfo {
  constructor(data) {
    Object.assign(this, data);
    this.priceFilter = this.filters.find((filter) => filter.filterType === filterTypes.PRICE);
    this.lotSizeFilter = this.filters.find((filter) => filter.filterType === filterTypes.LOT_SIZE);
    this.minNominalFilter = this.filters.find(
      (filter) => filter.filterType === filterTypes.MIN_NOMINAL
    );
  }

  /**
   * take a target price and make it comply with symbol's price filter
   * @param {Number} targetPrice calculated from engine
   */
  normalizePrice(targetPrice) {
    const { minPrice, maxPrice, tickSize } = this.priceFilter;
    let normalized = Math.max(minPrice, targetPrice);
    normalized = Math.min(normalized, maxPrice);
    while (castSatoshi(normalized - minPrice) % tickSize !== 0) {
      normalized = castSatoshi(normalized - Constants.ONE_HUNDRED_SHATOSHIS);
    }
    return normalized;
  }

  /**
   * take a target quantity and make it comply with symbol's lot size filter
   * @param {Number} targetQty calculated from engine
   */
  normalizeQty(targetQty) {
    const { minQty, maxQty, stepSize } = this.lotSizeFilter;
    let normalized = Math.max(minQty, targetQty);
    normalized = Math.min(normalized, maxQty);
    while (castSatoshi(normalized - minQty) % stepSize !== 0) {
      normalized = castSatoshi(normalized - Constants.ONE_HUNDRED_SHATOSHIS);
    }
    return normalized;
  }
}

module.exports = BinanceSymbolInfo;
