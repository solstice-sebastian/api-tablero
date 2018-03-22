const { getPercentDiff } = require('../common/helpers.js')();
const { NO_ENTRY, NO_EXIT, INSUFFICIENT_DATA } = require('../common/constants.js');

class TradePair {
  /**
   * @param {TrailAutoResult} entry
   * @param {TrailAutoResult} exit
   */
  constructor({ entry = null, exit = null }) {
    this._entry = entry;
    this._exit = exit;
    this._profitLoss = null;
  }

  getEntry() {
    if (this._entry === null) {
      return NO_ENTRY;
    }
    return this._entry;
  }

  getExit() {
    if (this._exit === null) {
      return NO_EXIT;
    }
    return this._exit;
  }

  getProfitLoss() {
    if (this.getEntry() === NO_ENTRY || this.getExit() === NO_EXIT) {
      return INSUFFICIENT_DATA;
    }
    return getPercentDiff(this.getEntry().getLastPrice(), this.getExit().getLastPrice());
  }

  getTimeBetween(isSeconds = true) {
    if (this.getEntry() === NO_ENTRY || this.getExit() === NO_EXIT) {
      return INSUFFICIENT_DATA;
    }
    const entryDate = new Date(this.getEntry().ticker.timestamp.replace('_', ' '));
    const exitDate = new Date(this.getExit().ticker.timestamp.replace('_', ' '));
    const msDiff = exitDate.getTime() - entryDate.getTime();
    if (isSeconds) {
      return msDiff / 1000;
    }
    return msDiff;
  }
}

module.exports = TradePair;
