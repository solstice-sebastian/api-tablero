const Ticker = require('./ticker.js');
const Adapter = require('./adapter.js');
const Constants = require('@solstice.sebastian/constants');
const { noop } = require('@solstice.sebastian/helpers');

const TIME_BETWEEN_REQUESTS = 1000 * 15;

class CoinigyTickerBook {
  constructor() {
    this.adapter = new Adapter();

    this.map = {};
    this.volumeSma = {};
    this.priceSma = {};
    this.baseVolumeSma = {};
  }

  onUpdate({ data }) {
    data.forEach((favorite) => {
      const ticker = new Ticker(favorite);
      const { symbol } = ticker;

      this.map[symbol] = ticker;
    });
  }

  getList() {
    return Object.keys(this.map).map((key) => this.map[key]);
  }

  getMap() {
    return this.map;
  }

  getTicker(symbol) {
    return this.map[symbol];
  }

  async fetch() {
    const endpoint = Constants.coinigy.endpoints.GET_FAVORITES;
    const favorites = await this.adapter.post(endpoint);
    this.onUpdate(favorites);
    return Promise.resolve(this);
  }

  poll({ timeout = TIME_BETWEEN_REQUESTS, callback = noop } = {}) {
    setInterval(() => {
      this.fetch().then(callback);
    }, timeout);

    this.fetch().then(callback);
  }

  serialize() {
    const payload = {
      tickers: this.getList(),
    };
    return JSON.stringify(payload);
  }
}

module.exports = CoinigyTickerBook;
