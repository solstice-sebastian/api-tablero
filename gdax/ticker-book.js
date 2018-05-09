const Gdax = require('gdax');
const GdaxTicker = require('./ticker.js');
const TickerBook = require('../models/ticker-book.js');

class GdaxTickerBook extends TickerBook {
  constructor() {
    super();
    this.client = new Gdax.PublicClient();
  }

  async load() {
    const data = await this.client.getProductTicker();
    const tickers = data.map((ticker) => new GdaxTicker(ticker));
    return this.init(tickers);
  }
}

module.exports = GdaxTickerBook;
