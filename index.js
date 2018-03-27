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

const BinanceCandle = require('./models/binance/candle.js');
const TrailBull = require('./modules/trail-bull.js');
const Constants = require('./common/constants.js');
const Emailer = require('./modules/emailer.js');
const { getPercentDiff } = require('./common/helpers.js')();

// subscribe to ticker prices
const interval = Constants.binance.intervals.ONE_MINUTE;
const channelName = `neobtc@kline_${interval}`;
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
const buffer = -0.01;
let startTicker = null;
let trailBull;

/**
 * @param {TradeResult} result
 */
const exitTrade = (result) => {
  // email results
  const profitLoss = getPercentDiff(startTicker.price, result.price);
  emailer.send({
    to: 'solstice.sebastian@gmail.com',
    text: `
      trade exited with profit loss of ${profitLoss.toFixed(3) * 100}%
      startPrice: ${startTicker.price}
      endPrice: ${result.price}
    `,
  });
};

ws.on('message', (response) => {
  const candle = new BinanceCandle(JSON.parse(response));
  if (startTicker === null) {
    startTicker = candle;
    trailBull = TrailBull({ startTicker, buffer });
  } else {
    const ticker = candle;
    const result = trailBull.update({ ticker });
    if (result.shouldContinue === false) {
      // trade exited
      exitTrade(result);
    }
  }
});
