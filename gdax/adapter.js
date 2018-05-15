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

  request(fn, ...args) {
    try {
      const response = fn(...args);
      return response;
    } catch (err) {
      throw err;
    }
  }

  getOrders(...args) {
    return this.request(this.client.getOrders, ...args);
  }

  getFills(...args) {
    return this.request(this.client.getFills, ...args);
  }
}

module.exports = GdaxAdapter;
