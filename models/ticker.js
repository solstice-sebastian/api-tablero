/**
 * @interface Ticker
 *
 * @param {Number} price in asset price
 * @param {String} symbol in 'ASSETBASE'
 * @param {Number} timestamp in milliseconds
 * @param {Number} volume of asset
 * @param {Number} baseVolume of base
 */

class Ticker {
  constructor(data) {
    this.price = data.price;
    this.symbol = data.symbol;
    this.timestamp = data.timestamp;
    this.volume = data.volume;
    this.baseVolume = data.baseVolume;
  }
}

module.exports = Ticker;
