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

  exchanges: {
    BINANCE: 'BINANCE',
    GDAX: 'GDAX',
  },

  binance: {
    stream: {
      HOSTNAME: 'stream.binance.com',
      PORT: 9443,
      CHANNEL_PREFIX: 'ws',
    },
    endpoints: {
      GET_OPEN_ORDERS: '/api/v3/openOrders',
      GET_SERVER_TIME: '/api/v1/time',
      GET_ACCOUNT_INFO: '/api/v3/account',
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
    statusCodes: {
      OVER_REQUEST_LIMIT: 429,
      BANNED_IP_ADDRESS: 418,
      UNKNOWN_TIMEOUT: 504,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      SUCCESS: 200,
      // malformed requests are 4XX
      // internal errors are 5XX
    },
    statuses: {
      symbol: {
        PRE_TRADING: 'PRE_TRADING',
        TRADING: 'TRADING',
        POST_TRADING: 'POST_TRADING',
        END_OF_DAY: 'END_OF_DAY',
        HALT: 'HALT',
        AUCTION_MATCH: 'AUCTION_MATCH',
        BREAK: 'BREAK',
      },
      trade: {
        NEW: 'NEW',
        PARTIALLY_FILLED: 'PARTIALLY_FILLED',
        FILLED: 'FILLED',
        CANCELED: 'CANCELED',
        REJECTED: 'REJECTED',
        EXPIRED: 'EXPIRED',
      },
    },
    orderTypes: {
      LIMIT: 'LIMIT',
      MARKET: 'MARKET',
      STOP_LOSS: 'STOP_LOSS',
      STOP_LOSS_LIMIT: 'STOP_LOSS_LIMIT',
      TAKE_PROFIT: 'TAKE_PROFIT',
      TAKE_PROFIT_LIMIT: 'TAKE_PROFIT_LIMIT',
      LIMIT_MAKER: 'LIMIT_MAKER',
    },
    orderSides: {
      BUY: 'BUY',
      SELL: 'SELL',
    },
    rateLimiters: {
      type: {
        REQUESTS: 'REQUESTS',
        ORDERS: 'ORDERS',
      },
      intervals: {
        SECOND: 'SECOND',
        MINUTE: 'MINUTE',
        DAY: 'DAY',
      },
    },
  },

  TRADE_FEE: 0.001,
};
