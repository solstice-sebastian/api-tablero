require('dotenv').config();
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const { toQueryString, validateRequired } = require('@solstice.sebastian/helpers');
const Constants = require('@solstice.sebastian/constants');

const { requestMethods, binance } = Constants;
const { orderSides, orderTypes } = binance;
const headers = {
  'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
};
const apiSecret = process.env.BINANCE_API_SECRET;

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
  async get(endpoint, params) {
    const url = this.getUrl(endpoint, params);
    try {
      const response = await fetch(url, { headers });
      if (response.status === Constants.binance.statusCodes.OVER_REQUEST_LIMIT) {
        throw new Error(`BinanceAdapter#get recieved OVER_REQUEST_LIMIT status`);
      }
      return response.json();
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {String} endpoint
   * @param {Object} params
   * @return {Promise}
   */
  async post(endpoint, params) {
    validateRequired(postRequirements, params, true);
    const url = this.getUrl(endpoint, params);
    const method = requestMethods.POST;
    try {
      const response = await fetch(url, { method, headers });
      if (response.status === Constants.binance.statusCodes.OVER_REQUEST_LIMIT) {
        throw new Error(`BinanceAdapter#post recieved OVER_REQUEST_LIMIT status`);
      }
      return response.json();
    } catch (err) {
      throw err;
    }
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
