const orders = require('./binance/orders.js')();
const balances = require('./binance/balances.js')();
const { tickers } = require('./tickers.js');

module.exports = () => ({ orders, balances, tickers });
