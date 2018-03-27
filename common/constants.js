module.exports = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_FILENAME: 'YYYYMMDD_HHmmss',
  NO_ENTRY: 'No entry',
  NO_EXIT: 'No exit',
  NO_LIMIT_PRICE: 'No limitPrice',
  NO_PRICE: 'No price',
  NO_TICKER: 'No ticker',
  INSUFFICIENT_DATA: 'Insufficient data',

  MS_PER_SECOND: 1000,
  MS_PER_MINUTE: 1000 * 60,
  MS_PER_HOUR: 1000 * 60 * 60,
  MS_PER_DAY: 1000 * 60 * 60 * 24,
  MS_PER_WEEK: 1000 * 60 * 60 * 24 * 7,

  botStates: {
    ENTERED: 'ENTERED',
    EXITED: 'EXITED',
  },

  binance: {
    stream: {
      HOSTNAME: 'stream.binance.com',
      PORT: 9443,
      CHANNEL_PREFIX: 'ws',
    },
    intervals: {
      ONE_MINUTE: '1m',
      THREE_MINUTES: '3m',
      FIVE_MINUTES: '5m',
      FIFTEEN_MINUTES: '15m',
      THIRTY_MINUTES: '30m',
      ONE_HOUR: '1h',
      TWO_HOURS: '2h',
      FOUR_HOURS: '4h',
      SIX_HOURS: '6h',
      EIGHT_HOURS: '8h',
      TWELVE_HOURS: '12h',
      ONE_DAY: '1d',
      THREE_DAYS: '3d',
      ONE_WEEK: '1w',
      ONE_MONTH: '1M',
    },
  },

  TRADE_FEE: 0.001,
};
