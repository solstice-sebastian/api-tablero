/**
 * set config
 * initiate trail bull
 * log results
 * email results
 *
 * wss://stream.binance.com:9443/ws/symbol@streamName
 * <symbol>@kline_<interval>
 */
require('dotenv').config();
const WebSocket = require('ws');
const fs = require('fs');

const cmdDefs = [
  { name: 'symbol', alias: 's', type: String },
  { name: 'buffer', alias: 'b', type: Number },
];
const commandLineArgs = require('command-line-args');

const BinanceCandle = require('./models/binance/candle.js');
const TrailBull = require('./modules/trail-bull.js');
const Constants = require('./common/constants.js');
const Emailer = require('./modules/emailer.js');
const { getPercentDiff, datetime, nicePercent } = require('./common/helpers.js')();

const options = commandLineArgs(cmdDefs);

// subscribe to ticker prices
const symbol = options.symbol || 'ncashbtc';
const interval = Constants.binance.intervals.ONE_MINUTE;
const channelName = `${symbol}@kline_${interval}`;
const address = `wss://stream.binance.com:9443/ws/${channelName}`;
const ws = new WebSocket(address);

// setup emailer
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const emailer = Emailer({ username, password, host });

ws.on('error', (err) => console.log('errored', err));

/**
 * trail a bull by -1%
 */
const buffer = options.buffer || -0.01;
let startTicker = null;
let trailBull;
const logFile = 'trade.log';

const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(logFile, `${datetime()}: ${msg}\n`);
};

/**
 * @param {Object} result { ticker, limitPrice, shouldContinue } from TrailBull
 */
const exitTrade = (result) => {
  // email results
  const startPrice = startTicker.price;
  const endPrice = result.ticker.price;
  const profitLoss = getPercentDiff(startPrice, endPrice, 4) - Constants.TRADE_FEE;
  const text = `\n\ttrade exited with profitLoss of ${nicePercent(
    profitLoss
  )}%\n\tstartPrice: ${startPrice}\n\tendPrice: ${endPrice}`;
  log(text);

  emailer.send({
    to: 'solstice.sebastian@gmail.com',
    text,
  });

  process.exit(1);
};

const updateLimitPrice = (prev, curr) => {
  const profitLoss = getPercentDiff(prev, curr, 4);
  log(`updating limitPrice ${prev} -> ${curr} = ${nicePercent(profitLoss)} profitLoss`);
};

ws.on('message', (response) => {
  const candle = new BinanceCandle(JSON.parse(response));
  if (startTicker === null) {
    startTicker = candle;
    trailBull = TrailBull({ startTicker, buffer, updateLimitPrice });
  } else {
    const ticker = candle;
    const result = trailBull.update({ ticker });
    if (result.shouldContinue === false) {
      // trade exited
      // TradeEngine.exit(result);
      exitTrade(result);
    }
  }
});
