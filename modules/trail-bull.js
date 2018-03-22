const { modByPercent, getPercentDiff } = require('../common/helpers.js')();
const { noop } = require('../common/helpers.js')();

/**
 * called with every `ticker`
 * checks against `buffer`
 * updates `limitPrice`
 * exits trade when correct conditions are met
 * @param {Ticker} startTicker the ticker to start trailing from
 * @param {Number} buffer float representation of a percentage i.e. -0.02 => -2%
 * @param {Function=} action to be called when trade should exit
 */
const TrailBull = ({ startTicker, buffer, action = noop }) => {
  let limitPrice = modByPercent(startTicker.lastPrice, buffer); // -0.5%

  /**
   * called on every ticker change
   * @param {Ticker}
   */
  const update = ({ ticker }) => {
    const percentDiff = getPercentDiff(ticker.lastPrice, limitPrice);

    if (ticker.lastPrice > 0 && ticker.lastPrice < limitPrice) {
      // exit trade
      action();
      return { ticker, limitPrice, shouldContinue: false };
    } else if (ticker.lastPrice > 0 && Math.abs(percentDiff) > Math.abs(buffer)) {
      // raise limitPrice
      limitPrice = modByPercent(ticker.lastPrice, buffer);
    }
    return { ticker, limitPrice, shouldContinue: true };
  };

  return { update };
};

module.exports = TrailBull;
