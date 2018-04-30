const fetch = require('node-fetch');
const Constants = require('../common/constants.js');
const Ticker = require('../models/ticker.js');

const { endpoints } = Constants;

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

  load() {
    const endpoint = endpoints.GET_TICKER;
    return new Promise((res, rej) => {
      fetch(endpoint)
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

  getUsdValue(symbol) {
    const btcPrice = this.indexedTickers[symbol].price;
    const tetherPrice = this.indexedTickers[this.tetherSymbol].price;
    return +(tetherPrice * btcPrice).toFixed(2);
  }
}

module.exports = BinanceTickerBook;
