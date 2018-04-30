const fetch = require('node-fetch');
const Constants = require('../common/constants.js');
const Ticker = require('../models/ticker.js');

const { endpoints } = Constants.binance;

class BinanceTickerBook {
  constructor(tetherSymbol = 'BTCUSDT') {
    this.tetherSymbol = tetherSymbol;
  }

  /**
   * to bypass the load
   */
  init(tickers) {
    this.tickers = tickers;
    this.indexedTickers = tickers.reduce((acc, curr) => {
      acc[curr.symbol] = new Ticker(curr);
      return acc;
    }, {});
    return this;
  }

  load(adapter) {
    const endpoint = endpoints.GET_TICKER;
    return new Promise((res, rej) => {
      adapter
        .get(endpoint)
        .then((response) => response.json())
        .then((tickers) => {
          res(this.init(tickers));
        })
        .catch((err) => rej(err));
    });
  }

  getSymbol(symbol) {
    return this.indexedTickers[symbol];
  }

  getBase(base) {
    return this.tickers.filter((ticker) => ticker.symbol.endsWith(base) === true);
  }

  getAsset(asset) {
    return this.tickers.filter((ticker) => ticker.symbol.startsWith(asset) === true);
  }

  /**
   * an estimate of the asset price in USD
   * this is seen to the right of the symbol price in the exchange
   *
   * @param {String} symbol
   */
  getUsdPriceForSymbol(symbol) {
    const btcPrice = this.indexedTickers[symbol].price;
    const tetherPrice = this.indexedTickers[this.tetherSymbol].price;
    return +(tetherPrice * btcPrice).toFixed(2);
  }

  /**
   * get current asset price in BTC
   *
   * @param {String} asset
   */
  getBtcPriceForAsset(asset) {
    const ticker = this.indexedTickers[`${asset}BTC`];
    return ticker !== undefined ? ticker.price : Constants.NO_TICKER;
  }
}

module.exports = BinanceTickerBook;
