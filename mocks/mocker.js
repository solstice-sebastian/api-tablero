const orders = require('./binance/orders.js')();
const balances = require('./binance/balances.js')();

module.exports = () => ({ orders, balances });
