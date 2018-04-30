const Ticker = require('../models/ticker.js');

const tickers = [
  new Ticker({ symbol: 'NCASHBTC', price: 0.0031 }),
  new Ticker({ symbol: 'XVGBTC', price: 0.0065 }),
  new Ticker({ symbol: 'ETHBTC', price: 0.2212 }),
  new Ticker({ symbol: 'LTCBTC', price: 0.016299 }),
  new Ticker({ symbol: 'NCASHETH', price: 0.02343 }),
  new Ticker({ symbol: 'XLMBTC', price: 0.00000731 }),
  new Ticker({ symbol: 'DASHBTC', price: 0.1832 }),
  new Ticker({ symbol: 'BTCUSDT', price: 9242.12 }),
  new Ticker({ symbol: 'ZECBTC', price: 0.01324 }),
];

module.exports = () => tickers;
