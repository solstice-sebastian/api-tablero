const { getPercentDiff, nicePercent } = require('../common/helpers.js')();
/**
 * analyzes a ticker book based on set threshold
 * pushes notifies when conditions are met
 */
class SmaAnalytic {
  /**
   * @param {Number} threshold percentDiff a value needs to surpass an sma to trigger notification
   * @param {String} smaKey used to get the sma from the tickerBook
   *
   * e.g. If `price` 25% above the `priceSma` then notify
   */
  constructor({ threshold, smaKey, valueKey, emailer }) {
    this.threshold = threshold;
    this.smaKey = smaKey;
    this.valueKey = valueKey;
    this.emailer = emailer;
  }

  analyze(tickerBook) {
    const list = tickerBook.getList();
    list.forEach((ticker) => {
      const { symbol } = ticker;
      const data = tickerBook.getData(symbol);
      const sma = data[this.smaKey];
      const value = data[this.valueKey];
      if (getPercentDiff(value, sma) > this.threshold) {
        this.notify({ sma, value, ticker });
      }
    });
  }

  notify({ sma, value, ticker }) {
    const { symbol } = ticker;
    const lines = [
      `${symbol}'s ${this.valueKey} changed more than sma threshold of ${nicePercent(
        this.threshold
      )}`,
      `${this.smaKey} = ${sma}`,
      `${this.valueKey} = ${value}`,
      `Ticker info:`,
      ticker.log(),
    ];
    const text = lines.join('\n');
    const subject = `MiComerciente update -- ${symbol}`;
    this.emailer.send({ text, subject });
  }
}

module.exports = SmaAnalytic;
