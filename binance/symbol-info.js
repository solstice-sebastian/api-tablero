/**
 * {
 *   "symbol": "ETHBTC",
 *   "status": "TRADING",
 *   "baseAsset": "ETH",
 *   "baseAssetPrecision": 8,
 *   "quoteAsset": "BTC", // base currency for trading
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

const Constants = require('@solstice.sebastian/constants');
const { castSatoshi } = require('@solstice.sebastian/helpers');

const { filterTypes } = Constants.binance;

class BinanceSymbolInfo {
  constructor(symbolInfo) {
    Object.assign(this, symbolInfo);
    this.priceFilter = this.filters.find((filter) => filter.filterType === filterTypes.PRICE);
    this.qtyFilter = this.filters.find((filter) => filter.filterType === filterTypes.QUANTITY);
    this.minNominalFilter = this.filters.find(
      (filter) => filter.filterType === filterTypes.MIN_NOMINAL
    );

    this.castFilters();
  }

  castFilters() {
    this.priceFilter.minPrice = +this.priceFilter.minPrice;
    this.priceFilter.maxPrice = +this.priceFilter.maxPrice;
    this.priceFilter.tickSize = +this.priceFilter.tickSize;

    this.qtyFilter.minQty = +this.qtyFilter.minQty;
    this.qtyFilter.maxQty = +this.qtyFilter.maxQty;
    this.qtyFilter.stepSize = +this.qtyFilter.stepSize;
  }

  /**
   * take a target price and make it comply with symbol's price filter
   * @param {Number} targetPrice calculated from engine
   */
  normalizePrice(targetPrice) {
    const { minPrice, maxPrice, tickSize } = this.priceFilter;
    let normalized = Math.max(minPrice, targetPrice);
    normalized = Math.min(normalized, maxPrice);
    while (
      normalized !== minPrice &&
      normalized !== maxPrice &&
      normalized !== Constants.ONE_HUNDRED_SHATOSHIS && // would result in zero
      castSatoshi(normalized - minPrice) % tickSize !== 0
    ) {
      if (Number.isNaN(minPrice) || Number.isNaN(normalized) || Number.isNaN(tickSize)) {
        throw new Error(`normalizePrice received NaN`);
      }
      normalized = castSatoshi(normalized - Constants.ONE_HUNDRED_SHATOSHIS);
    }
    // return normalized.toFixed(this.quotePrecision);
    return normalized;
  }

  /**
   * take a target quantity and make it comply with symbol's lot size filter
   * @param {Number} targetQty calculated from engine
   */
  normalizeQty(targetQty) {
    const { minQty, maxQty, stepSize } = this.qtyFilter;
    let normalized = Math.max(minQty, targetQty);
    normalized = Math.min(normalized, maxQty);
    while (
      normalized !== minQty &&
      normalized !== maxQty &&
      normalized !== Constants.ONE_HUNDRED_SHATOSHIS && // would result in zero
      castSatoshi(normalized - minQty) % stepSize !== 0
    ) {
      if (Number.isNaN(minQty) || Number.isNaN(normalized) || Number.isNaN(stepSize)) {
        throw new Error(`normalizeQty received NaN`);
      }
      normalized = castSatoshi(normalized - Constants.ONE_HUNDRED_SHATOSHIS);
    }
    // return normalized.toFixed(this.baseAssetPrecision);
    return normalized;
  }
}

module.exports = BinanceSymbolInfo;
