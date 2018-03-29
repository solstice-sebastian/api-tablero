const fetch = require('node-fetch');
// const forge = require('node-forge');
const CryptoJS = require('crypto-js');
const Constants = require('../common/constants.js');
const { toQueryString } = require('../common/helpers.js')();

/**
 * handles endpoints regarding open and historical orders
 */
const BinanceAdapter = ({ host = 'https://api.binance.com', headers, apiSecret }) => {
  /**
   * build url from host + endpoint + queryString
   * @param {String} endpoint
   * @param {String=} queryString
   */
  const getUrl = (endpoint, queryString) => {
    if (queryString !== undefined) {
      return `${host}${endpoint}?${queryString}`;
    }
    return `${host}${endpoint}`;
  };

  /**
   * turns object of params into query string and then signs it with sha256 HMAC sha
   * @param {Object} params
   * @return {String} signature
   */
  const getSignature = (params) => {
    if (typeof params !== 'object') {
      throw new Error(`getSignature expect object. received: ${typeof params}`);
    }
    const queryString = toQueryString(params);
    const hash = CryptoJS.HmacSHA256(queryString, apiSecret);
    return CryptoJS.enc.Hex.stringify(hash);
  };

  /**
   * get the server time
   */
  const getServerTime = () => {
    const endpoint = Constants.binance.endpoints.GET_SERVER_TIME;
    const url = getUrl(endpoint);
    return fetch(url);
  };

  /**
   * @param {Number} timestamp
   * @param {String?} symbol
   * @param {Number?} recvWindow
   */
  const getOpenOrders = ({ timestamp, symbol, recvWindow }) => {
    if (timestamp === undefined) {
      throw new Error('getOpenOrders requires timestamp');
    }

    // const method = 'GET';
    const params = { timestamp, symbol, recvWindow };
    const signature = getSignature(params);
    const queryString = toQueryString(Object.assign({}, params, { signature }));
    const endpoint = Constants.binance.endpoints.GET_OPEN_ORDERS;
    const url = getUrl(endpoint, queryString);

    return fetch(url, { headers });
  };

  return { getOpenOrders, getServerTime };
};

module.exports = BinanceAdapter;
