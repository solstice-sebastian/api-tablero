const Ticker = require('../models/ticker.js');
const { modByPercent } = require('@solstice.sebastian/helpers')();

let tickers = [
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

const fetch = () => {
  tickers = tickers.map((ticker) => {
    let newPrice;
    if (Math.random() > 0.5) {
      newPrice = modByPercent(ticker.price, 0.025); // increase 0.25%
    } else {
      newPrice = modByPercent(ticker.price, -0.025); // decrease 0.25%
    }
    return new Ticker({
      symbol: ticker.symbol,
      price: newPrice,
    });
  });
  return tickers;
};

module.exports = { tickers, fetch };
