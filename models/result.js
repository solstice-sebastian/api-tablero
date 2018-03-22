const Constants = require('../common/constants.js');

/**
 * helper class for structuring results
 */
class Result {
  constructor({ ticker, limitPrice } = {}) {
    this.ticker = ticker;
    this.limitPrice = limitPrice;
  }

  getLimitPrice() {
    if (this.ticker === null || Number.isNaN(+this.limitPrice)) {
      return Constants.NO_LIMIT_PRICE;
    }
    return this.limitPrice;
  }

  getTicker() {
    if (this.ticker === null || this.ticker === undefined) {
      return Constants.NO_TICKER;
    }
    return this.ticker;
  }

  getLastPrice() {
    const ticker = this.getTicker();
    if (ticker === Constants.NO_TICKER) {
      return Constants.NO_LAST_PRICE;
    }
    return ticker.lastPrice;
  }
}

module.exports = Result;
