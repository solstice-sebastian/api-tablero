const Ticker = require('../models/ticker.js');

const tickers = [
  new Ticker({ symbol: 'NCASHBTC', price: 0.0031 }),
  new Ticker({ symbol: 'XVGBTC', price: 0.0065 }),
  new Ticker({ symbol: 'ETHBTC', price: 0.2212 }),
  new Ticker({ symbol: 'LTCBTC', price: 0.1245 }),
  new Ticker({ symbol: 'XLMBTC', price: 0.00000731 }),
  new Ticker({ symbol: 'DASHBTC', price: 0.1832 }),
  new Ticker({ symbol: 'BTCUSDT', price: 9242.12 }),
];

module.exports = () => tickers;
