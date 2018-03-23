/**
 * set config
 * initiate trail bull
 * poller.js to run trail-bull
 * log results
 * email results
 *
 * wss://stream.binance.com:9443/ws/symbol@streamName
 * <symbol>@kline_<interval>
 */
require('dotenv').config();
// const fetch = require('node-fetch');
// const Ticker = require('./models/ticker.js');
// const Constants = require('./common/constants.js');
const WebSocket = require('ws');

// subscribe to ticker prices
// const interval = Constants.binance.intervals.ONE_MINUTE;
// const channelName = `neobtc@kline_${interval}`;
// const address = `wss://stream.binance.com:9443/ws/${channelName}`;
const address = 'wss://stream.binance.com:9443/ws/bnbbtc@depth';
const ws = new WebSocket(address);

ws.on('message', (data) => {
  console.log('data', JSON.stringify(data));
});

ws.on('error', (err) => console.log('errored', err));
