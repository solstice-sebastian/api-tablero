const Constants = require('@solstice.sebastian/constants');

/**
 * @implements Ticker
 *
 * @param {Number} price in asset price
 * @param {String} symbol in 'ASSETBASE'
 * @param {Number} timestamp in milliseconds
 * @param {Number} volume of asset
 * @param {Number} baseVolume of base
 */

class CoinigyTicker {
  constructor(data = {}) {
    this.id = +data.exchmkt_id;
    this.mktName = data.mkt_name;
    this.exchangeCode = data.exch_code;
    this.exchangeName = data.exch_name;
    this.primaryCurrencyName = data.primary_currency_name;
    this.secondaryCurrencyName = data.secondary_currency_name;
    this.serverTime = data.server_time;
    this.lastPrice = +data.last_price;
    this.prevPrice = +data.prev_price;
    this.highTrade = +data.high_trade;
    this.lowTrade = +data.low_trade;
    this.fiatMarket = +data.fiat_market;
    this.btcVolume = +data.btc_volume;

    this.price = this.lastPrice;
    this.symbol = this.mktName.replace('/', '');
    this.timestamp = new Date(data.server_time).getTime() - Constants.MS_PER_HOUR * 8;
    this.volume = +data.current_volume;
    this.baseVolume = this.btcVolume;
  }
}

module.exports = CoinigyTicker;
