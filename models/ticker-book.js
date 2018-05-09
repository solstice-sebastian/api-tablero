const Ticker = require('./ticker.js');

class TickerBook {
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

  /**
   * @override
   */
  load() {}

  getSymbol(symbol) {
    return this.indexedTickers[symbol];
  }

  getBase(base) {
    return this.tickers.filter((ticker) => ticker.symbol.endsWith(base) === true);
  }

  getAsset(asset) {
    return this.tickers.filter((ticker) => ticker.symbol.startsWith(asset) === true);
  }

  serialize() {
    return JSON.stringify(this.indexedTickers);
  }
}

module.exports = TickerBook;
