const Ticker = require('./ticker.js');
const Adapter = require('./adapter.js');
const Constants = require('../common/constants.js');
const SimpleMovingAverage = require('../modules/simple-moving-average.js');
const { noop } = require('../common/helpers.js')();

const TIME_BETWEEN_REQUESTS = 1000 * 15;
const period = 30;

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

      if (this.map[symbol] === undefined) {
        // new map
        this.map[symbol] = ticker;
        const { price, volume, baseVolume } = ticker;

        // moving averages
        this.volumeSma[symbol] = {};
        this.volumeSma[symbol] = SimpleMovingAverage({
          period,
          values: [volume],
        });
        this.baseVolumeSma[symbol] = {};
        this.baseVolumeSma[symbol] = SimpleMovingAverage({
          period,
          values: [baseVolume],
        });
        this.priceSma[symbol] = {};
        this.priceSma[symbol] = SimpleMovingAverage({
          period,
          values: [price],
        });
      } else {
        this.updateLists(ticker);
      }
    });
  }

  updateLists(ticker) {
    const { price, volume, symbol, baseVolume } = ticker;
    this.priceSma[symbol].update(price);
    this.volumeSma[symbol].update(volume);
    this.baseVolumeSma[symbol].update(baseVolume);
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

  getSmas(symbol) {
    return {
      priceSma: this.priceSma[symbol],
      volumeSma: this.volumeSma[symbol],
      baseVolumeSma: this.baseVolumeSma[symbol],
    };
  }

  getData(symbol) {
    const data = this.getSmas(symbol);
    const ticker = this.getTicker(symbol);
    return {
      price: ticker.price,
      priceSma: data.priceSma.calc(),

      volume: ticker.volume,
      volumeSma: data.volumeSma.calc(),

      baseVolume: ticker.baseVolume,
      baseVolumeSma: data.baseVolumeSma.calc(),
    };
  }

  async getFavorites() {
    const endpoint = Constants.coinigy.endpoints.GET_FAVORITES;
    const favorites = await this.adapter.post(endpoint);
    this.onUpdate(favorites);
    return Promise.resolve(this);
  }

  poll({ timeout = TIME_BETWEEN_REQUESTS, callback = noop }) {
    setInterval(() => {
      this.getFavorites().then(callback);
    }, timeout);

    this.getFavorites().then(callback);
  }

  serialize() {
    const payload = {
      tickers: this.getMap(),
    };
    return JSON.stringify(payload);
  }
}

module.exports = CoinigyTickerBook;
