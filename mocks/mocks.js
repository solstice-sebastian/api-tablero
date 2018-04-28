const orders = require('./binance/orders.js')();
const balances = require('./binance/balances.js')();
const tickers = require('./tickers.js')();

const indexedTickers = tickers.reduce((acc, curr) => {
  acc[curr.symbol] = curr;
  return acc;
}, {});

module.exports = () => ({ orders, balances, tickers, indexedTickers });
