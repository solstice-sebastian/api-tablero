require('dotenv').config();
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const { toQueryString } = require('../common/helpers.js')();
const Constants = require('../common/constants.js');

const { requestMethods } = Constants;
const headers = {
  'X-MBX-APIKEY': process.env.API_KEY,
};
const apiSecret = process.env.API_SECRET;

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
    const url = this.getUrl(endpoint, params);
    const method = requestMethods.POST;
    const body = JSON.stringify(params);
    return fetch(url, { method, headers, body });
  }

  /**
   * build url from host + endpoint + queryString
   * @param {String} endpoint
   * @param {Object} params
   * @return {String} url to pass to fetch
   */
  getUrl(endpoint, params) {
    let url = `${this.host}${endpoint}`;
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
    const queryString = toQueryString(params);
    const hash = CryptoJS.HmacSHA256(queryString, apiSecret);
    const signature = CryptoJS.enc.Hex.stringify(hash);
    return toQueryString(Object.assign({}, params, { signature }));
  }
}

module.exports = BinanceAdapter;
