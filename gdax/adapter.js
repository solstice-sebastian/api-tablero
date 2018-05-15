require('dotenv').config();
const Gdax = require('gdax');

const key = process.env.GDAX_API_KEY;
const secret = process.env.GDAX_API_SECRET;
const passphrase = process.env.GDAX_PASSPHRASE;

const apiURI = process.env.GDAX_API_URI;

// const sandboxURI = 'https://api-public.sandbox.gdax.com';

class GdaxAdapter {
  constructor() {
    this.client = new Gdax.AuthenticatedClient(key, secret, passphrase, apiURI);
  }

  async request(fn, ...args) {
    try {
      const response = await fn(...args);
      return response;
    } catch (err) {
      throw err;
    }
  }

  getBalances(...args) {
    // return this.request(this.client.getAccounts, ...args);
    return this.client.getAccounts();
  }

  getOrders(...args) {
    return this.request(this.client.getOrders, ...args);
  }

  getFills(...args) {
    return this.request(this.client.getFills, ...args);
  }
}

module.exports = GdaxAdapter;
