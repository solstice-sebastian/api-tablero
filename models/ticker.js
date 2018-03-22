/**
 * {
 *    "exchmkt_id": "7435",
 *    "mkt_name": "BTC/USD",
 *    "exch_code": "GDAX",
 *    "exch_name": "Global Digital Asset Exchange",
 *    "primary_currency_name": "United States Dollar",
 *    "secondary_currency_name": "Bitcoin",
 *    "server_time": "2016-07-03 16:19:05",
 *    "last_price": "662.51",
 *    "prev_price": "0",
 *    "high_trade": "705.2500000000",
 *    "low_trade": "652.0000000000",
 *    "current_volume": "6545.1788898100",
 *    "fiat_market": "1",
 *    "btc_volume": "6545.178889810000000000"
 * },
 */
class Ticker {
  constructor(data = {}) {
    this.id = data.exchmkt_id || data.id;
    this.symbol = data.mkt_name || data.symbol;
    this.exchangeCode = data.exch_code || data.exchangeCode;
    this.exchangeName = data.exch_name || data.exchangeName;
    this.primaryCurrencyName = data.primary_currency_name || data.primaryCurrencyName;
    this.secondaryCurrencyName = data.secondary_currency_name || data.secondaryCurrencyName;
    this.timestamp = data.server_time || data.serverTime || data.timestamp;
    this.lastPrice = data.last_price || data.lastPrice;
    this.prevPrice = data.prev_price || data.prevPrice;
    this.highTrade = data.high_trade || data.highTrade;
    this.lowTrade = data.low_trade || data.lowTrade;
    this.volume = data.current_volume || data.volume;
    this.fiatMarket = data.fiat_market || data.fiatMarket;
    this.btcVolume = data.btc_volume || data.btcVolume;
  }

  static getKeys() {
    return [
      `id`,
      `symbol`,
      `exchangeCode`,
      `timestamp`,
      `lastPrice`,
      `prevPrice`,
      `highTrade`,
      `lowTrade`,
      `volume`,
      `btcVolume`,
    ];
  }

  parse() {
    return Object.assign(
      {},
      {
        id: +this.id,
        symbol: this.symbol,
        exchangeCode: this.exchangeCode,
        timestamp: this.timestamp,
        lastPrice: +this.lastPrice,
        prevPrice: +this.prevPrice,
        highTrade: +this.highTrade,
        lowTrade: +this.lowTrade,
        volume: +this.volume,
        btcVolume: +this.btcVolume,
      }
    );
  }
}

module.exports = Ticker;
