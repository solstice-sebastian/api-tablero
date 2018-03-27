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
const BinanceCandle = require('./models/binance/candle.js');
const TrailBull = require('./modules/trail-bull.js');
const Constants = require('./common/constants.js');
const WebSocket = require('ws');

// subscribe to ticker prices
const interval = Constants.binance.intervals.ONE_MINUTE;
const channelName = `neobtc@kline_${interval}`;
const address = `wss://stream.binance.com:9443/ws/${channelName}`;
// const address = 'wss://stream.binance.com:9443/ws/bnbbtc@depth';
const ws = new WebSocket(address);

ws.on('error', (err) => console.log('errored', err));

/**
 * trail a bull by -1%
 */
const buffer = -0.01;
let startTicker = null;
let trailBull;

ws.on('message', (response) => {
  const candle = new BinanceCandle(JSON.parse(response));
  if (startTicker === null) {
    startTicker = candle;
    trailBull = TrailBull({ startTicker, buffer });
  } else {
    const result = new TradeResult(trailBull.update({ ticker }));
    if (result.shouldContinue === false) {
      // trade exited
      exitTrade(result);
    }
  }
});
