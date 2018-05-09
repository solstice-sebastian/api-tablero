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
 *   "trade_id": 4729088,
 *   "price": "333.99",
 *   "size": "0.193",
 *   "bid": "333.98",
 *   "ask": "333.99",
 *   "volume": "5957.11914015",
 *   "time": "2015-11-14T20:46:03.511254Z"
 * }
 */
class GdaxTicker {
  constructor(data) {
    this.price = data.price;
    this.symbol = `${data.quote_currency}${data.base_currency}`;
    this.timestamp = new Date(data.time).getTime();
    this.volume = data.volume;
    this.baseVolume = data.baseVolume;
  }
}

module.exports = GdaxTicker;
