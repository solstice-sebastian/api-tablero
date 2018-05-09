const TickerBook = require('../models/ticker-book.js');
const Ticker = require('./ticker.js');
const Adapter = require('./adapter.js');
const Constants = require('../common/constants.js');
const { noop } = require('../common/helpers.js')();

const TIME_BETWEEN_REQUESTS = 1000 * 15;

class CoinigyTickerBook extends TickerBook {
  constructor() {
    super();
    this.adapter = new Adapter();
    this.map = {};
  }

  onUpdate(favorites) {
    favorites.forEach((favorite) => {
      const ticker = new Ticker(favorite);
      const { symbol } = ticker;
      if (this.map[symbol] === undefined) {
        // new map
        this.map[symbol] = ticker;
      } else {
        // update old info with latest
        this.map[symbol].update(ticker);
      }
    });
  }

  getList() {
    return Object.keys(this.map).map((key) => this.map[key]);
  }

  getMap() {
    return this.map;
  }

  async getFavorites() {
    const endpoint = Constants.coinigy.endpoints.GET_FAVORITES;
    const favorites = await this.adapter.post(endpoint);
    this.onUpdate(favorites);
    return Promise.resolve(this);
  }

  poll({ timeout = TIME_BETWEEN_REQUESTS, cb = noop }) {
    setInterval(() => {
      this.getFavorites().then(cb);
    }, timeout);

    this.getFavorites().then(cb);
  }
}

module.exports = CoinigyTickerBook;
