const moment = require('moment');
const glob = require('glob');
const fs = require('fs');
const { DATETIME, DATETIME_FILENAME } = require('./constants.js');

const Helpers = () => {
  /**
   * @param price {Number}
   * @param mod {Number} percentage in float form i.e. 2% => 0.02 || -2% => -0.02
   */
  const modByPercent = (price, mod, digits = 10) => +(price * (1 + mod)).toFixed(digits);

  /**
   * @param start {Number}
   * @param end {Number}
   * @return float representation of a percent i.e. 2% => 0.02 || -2% => -0.02
   */
  const getPercentDiff = (start, end, digits = 10) => {
    let diff;
    if (end < start) {
      diff = (start - end) / start * -1;
    } else {
      diff = (end - start) / start;
    }
    return +diff.toFixed(digits);
  };

  const globDelete = (globStr) =>
    new Promise((res, rej) => {
      glob(globStr, (err, files) => {
        if (err) {
          rej(err);
        } else {
          files.forEach(fs.unlinkSync);
          res();
        }
      });
    });

  const noop = () => {};

  const datetimeForFilename = () => moment().format(DATETIME_FILENAME);
  const datetime = () => moment().format(DATETIME);

  return { modByPercent, getPercentDiff, noop, datetime, datetimeForFilename, globDelete };
};

if (typeof module !== 'undefined') {
  module.exports = Helpers;
} else if (typeof window !== 'undefined') {
  window.Helpers = Helpers;
}
