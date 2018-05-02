const BinanceBalance = require('../../binance/balance.js');

const free = [
  new BinanceBalance({
    asset: 'LTC',
    free: 124.42,
    locked: 0.0,
  }),
  new BinanceBalance({
    asset: 'ETH',
    free: 623.12,
    locked: 0.0,
  }),
  new BinanceBalance({
    asset: 'NCASH',
    free: 1123.563,
    locked: 0.0,
  }),
  new BinanceBalance({
    asset: 'DASH',
    free: 1.032,
    locked: 0.0,
  }),
  new BinanceBalance({
    asset: 'BTC',
    free: 0.034132,
    locked: 0.0,
  }),
];

const inActive = [
  new BinanceBalance({
    asset: 'ZEC',
    free: 0.034132,
    locked: 0.0,
  }),
  new BinanceBalance({
    asset: 'STORJ',
    free: 0.00934,
    locked: 0.0,
  }),
  new BinanceBalance({
    asset: 'XRP',
    free: 0.01944,
    locked: 0.0,
  }),
];

const locked = [
  new BinanceBalance({
    asset: 'XLM',
    free: 0.00123,
    locked: 1243.32,
  }),
  new BinanceBalance({
    asset: 'XVG',
    free: 0.387,
    locked: 0.42,
  }),
];

const balances = [...free, ...locked, ...inActive];

module.exports = () => balances;
