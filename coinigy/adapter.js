require('dotenv').config();
const path = require('path');
const qs = require('qs');
const fetch = require('node-fetch');
const Constants = require('../common/constants.js');

const { coinigy } = Constants;
const apiKey = process.env.COINIGY_API_KEY;
const apiSecret = process.env.COINIGY_API_SECRET;

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
  'X-API-SECRET': apiSecret,
};

class CoinigyAdapter {
  constructor(host = coinigy.API_HOST) {
    this.host = host;
  }

  /**
   * @param {String} endpoint
   * @param {Object} params
   * @return {Promise}
   */
  async get(endpoint, params) {
    const queryString = qs.stringify(params);
    const url = path.join(this.host, endpoint, queryString);
    try {
      const response = await fetch(url, { headers });
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
  async post(endpoint, params = {}) {
    const url = path.join(this.host, endpoint);
    const method = Constants.requestMethods.POST;
    const body = JSON.stringify(params);
    try {
      const response = await fetch(url, { method, headers, body });
      return response.json();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CoinigyAdapter;
