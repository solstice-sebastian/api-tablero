require('dotenv').config();
const Gdax = require('gdax');
const Constants = require('@solstice.sebastian/constants');

const { orderStatuses } = Constants.gdax;

const key = process.env.GDAX_API_KEY;
const secret = process.env.GDAX_API_SECRET;
const passphrase = process.env.GDAX_PASSPHRASE;

const apiURI = process.env.GDAX_API_URI;

// const sandboxURI = 'https://api-public.sandbox.gdax.com';

class GdaxAdapter {
  constructor() {
    this.client = new Gdax.AuthenticatedClient(key, secret, passphrase, apiURI);
  }

  getBalances() {
    return this.client.getAccounts();
  }

  getOrders() {
    return this.client.getOrders({ status: orderStatuses.ALL });
  }
}

module.exports = GdaxAdapter;
