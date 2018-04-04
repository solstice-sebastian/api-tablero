require('dotenv').config();
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const { toQueryString, validateRequired } = require('../common/helpers.js')();
const Constants = require('../common/constants.js');

const { requestMethods, binance } = Constants;
const { orderSides, orderTypes } = binance;
const headers = {
  'X-MBX-APIKEY': process.env.API_KEY,
};
const apiSecret = process.env.API_SECRET;

const postRequirements = {
  symbol: {
    type: 'string', // later to be a TickerSymbol
  },
  side: {
    validator: (val) => Object.keys(orderSides).includes(val), // later to be Enum
  },
  type: {
    validator: (val) => Object.keys(orderTypes).includes(val),
  },
  quantity: {
    validator: (val) => val > 0,
  },
  timestamp: {
    validator: (val) => val > 0,
  },
};

/**
 * handles endpoints regarding open and historical orders
 * @implements Adapter
 */
class BinanceAdapter {
  constructor() {
    this.host = Constants.binance.API_HOST;
    this.apiSecret = apiSecret;
  }

  /**
   * @param {String} endpoint
   * @param {Object} params
   * @return {Promise}
   */
  get(endpoint, params) {
    const url = this.getUrl(endpoint, params);
    return fetch(url, { headers });
  }

  /**
   * @param {String} endpoint
   * @param {Object} params
   * @return {Promise}
   */
  post(endpoint, params) {
    validateRequired(postRequirements, params, true);
    const url = this.getUrl(endpoint, params);
    const method = requestMethods.POST;
    return fetch(url, { method, headers });
  }

  /**
   * build url from host + endpoint + queryString
   * @param {String} endpoint
   * @param {Object} params
   * @return {String} url to pass to fetch
   */
  getUrl(endpoint, params) {
    let url = `${this.host}${endpoint}`;
    // only need to sign if params are required
    if (params !== undefined) {
      const signedQueryString = BinanceAdapter.buildSignedQueryString(params);
      url += `?${signedQueryString}`;
    }

    return url;
  }

  /**
   * turns object of params into query string and then signs it with sha256 HMAC sha
   * @param {Object} params
   * @return {String} signed query string built from params and secret
   */
  static buildSignedQueryString(params) {
    if (typeof params !== 'object') {
      throw new Error(`getSignature expect object. received: ${typeof params}`);
    }
    const signature = BinanceAdapter.getSignature(params);
    return toQueryString(Object.assign({}, params, { signature }));
  }

  static getSignature(params) {
    const queryString = toQueryString(params);
    const hash = CryptoJS.HmacSHA256(queryString, apiSecret);
    const signature = CryptoJS.enc.Hex.stringify(hash);
    return signature;
  }
}

module.exports = BinanceAdapter;
