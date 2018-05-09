const Constants = require('../common/constants.js');
const TickerBook = require('../models/ticker-book.js');

const { endpoints } = Constants.binance;

class BinanceTickerBook extends TickerBook {
  constructor(tetherSymbol = 'BTCUSDT') {
    super();
    this.tetherSymbol = tetherSymbol;
  }

  load(adapter) {
    const endpoint = endpoints.GET_TICKER;
    return new Promise((res, rej) => {
      adapter
        .get(endpoint)
        .then((tickers) => {
          res(this.init(tickers));
        })
        .catch((err) => rej(err));
    });
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
