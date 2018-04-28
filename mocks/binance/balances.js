const free = [
  {
    asset: 'LTC',
    free: '124.42',
    locked: '0.00000000',
  },
  {
    asset: 'ETH',
    free: '623.12',
    locked: '0.00000000',
  },
  {
    asset: 'NCASH',
    free: '1123.563',
    locked: '0.00000000',
  },
  {
    asset: 'DASH',
    free: '1.032',
    locked: '0.00000000',
  },
];

const inActive = [
  {
    asset: 'BTC',
    free: '0.034132',
    locked: '0.00000000',
  },

  {
    asset: 'ZEC',
    free: '0.034132',
    locked: '0.0000',
  },

  {
    asset: 'STORJ',
    free: '0.00934',
    locked: '0.0000',
  },

  {
    asset: 'BTC',
    free: '0.034132',
    locked: '0.00000000',
  },
];

const locked = [
  {
    asset: 'XLM',
    free: '0.00123',
    locked: '1243.32',
  },
  {
    asset: 'XVG',
    free: '0.387',
    locked: '0.42',
  },
];

const balances = [...free, ...locked, ...inActive];

module.exports = () => balances;
