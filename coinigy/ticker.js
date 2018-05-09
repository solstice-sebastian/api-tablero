const Constants = require('../common/constants.js');
const SimpleMovingAverage = require('../modules/simple-moving-average.js');

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
  constructor(data = {}, period = 30) {
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

    // moving averages
    this.volumeList = SimpleMovingAverage({ period, values: [this.volume] });
    this.baseVolumeList = SimpleMovingAverage({ period, values: [this.baseVolume] });
    this.priceList = SimpleMovingAverage({ period, values: [this.price] });
  }

  update(ticker) {
    this.price = ticker.price;
    this.volume = ticker.volume;
    this.baseVolume = ticker.baseVolume;

    this.priceList.update(ticker.price);
    this.volumeList.update(ticker.volume);
    this.baseVolumeList.update(ticker.baseVolume);
  }
}

module.exports = CoinigyTicker;
