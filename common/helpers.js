/* eslint valid-typeof: 'off' */
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
    const _start = +start;
    const _end = +end;

    let diff;
    if (_end < _start) {
      diff = (_start - _end) / _start * -1;
    } else {
      diff = (_end - _start) / _start;
    }
    return +diff.toFixed(digits);
  };

  const nicePercent = (percent, digits = 2) => `${(percent * 100).toFixed(digits)}%`;

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
  const msToDatetime = (ms) => moment(ms).format(DATETIME);

  const toQueryString = (obj) => {
    let str = '';
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        str = `${str}&${key}=${obj[key]}`;
      }
    });
    return str.replace(/&$/, '').replace(/^&/, '');
  };

  /**
   * @param required [key] { type, validator }
   */
  const validateRequired = (required = {}, params = {}, shouldThrow = false) => {
    const requiredKeys = Object.keys(required);
    const errors = [];

    Object.keys(required).forEach((key) => {
      const value = params[key];
      const requiredItem = required[key];

      if (requiredKeys.includes(key) === true) {
        if (value === undefined) {
          // is required but undefined
          errors.push(`Missing param '${key}'`);
        } else if (requiredItem.type !== undefined && typeof value !== requiredItem.type) {
          // is required but wrong type
          errors.push(`Incorrect type for param '${key}'. Received '${typeof value}'`);
        } else if (
          typeof requiredItem.validator === 'function' &&
          requiredItem.validator(value) === false
        ) {
          errors.push(`Failed validator function for param '${key}'`);
        }
      }
    });

    if (errors.length > 0 && shouldThrow === true) {
      throw new Error(errors.join('\n'));
    } else {
      return errors.map((msg) => new Error(msg));
    }
  };

  return {
    modByPercent,
    getPercentDiff,
    noop,
    datetime,
    datetimeForFilename,
    globDelete,
    msToDatetime,
    nicePercent,
    toQueryString,
    validateRequired,
  };
};

if (typeof module !== 'undefined') {
  module.exports = Helpers;
} else if (typeof window !== 'undefined') {
  window.Helpers = Helpers;
}
