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

const cmdDefs = [
  { name: 'symbol', alias: 's', type: String },
  { name: 'buffer', alias: 'b', type: Number },
  { name: 'entryPrice', alias: 'ep', type: String },
];
const commandLineArgs = require('command-line-args');

const TrailBull = require('./modules/trail-bull.js');
const Constants = require('./common/constants.js');
const Emailer = require('./modules/emailer.js');
const { log } = require('./common/logger.js')();
const { getPercentDiff, nicePercent } = require('./common/helpers.js')();

// binance modules
const Candle = require('./binance/candle.js');
const BalanceBook = require('./binance/balance-book.js');
const Trader = require('./binance/trader.js');
const Adapter = require('./binance/adapter.js');
const Order = require('./binance/order.js');
const ExchangeInfo = require('./binance/exchange-info.js');

/**
 * Program flow:
 * cmd line args set config
 * init() -> loads binance info
 * enter() -> polls until filled
 * run() -> trails bull
 * exit() -> polls until filled
 * notify() -> emails results
 */
class TradeBinance {
  constructor() {
    const cmdLineOptions = commandLineArgs(cmdDefs);
    if (cmdLineOptions.entryPrice === undefined) {
      throw new Error('entryPrice is required');
    }

    const defaults = {
      symbol: 'ncashbtc',
      buffer: 0.005, // 0.5%
      interval: Constants.binance.intervals.ONE_MINUTE,
    };

    this.config = Object.assign({}, defaults, cmdLineOptions);
    this.init().then(() => this.enter());
  }

  /**
   * initialize balance modules
   */
  init() {
    const adapter = new Adapter();
    // used to get current balances to set qty
    this.balanceBook = new BalanceBook();
    this.balanceBook.load(adapter);
    // used to get normalized price/qty for orders
    this.exchangeInfo = new ExchangeInfo();
    this.exchangeInfo.load();
    this.trader = new Trader(adapter);
  }

  enter() {}

  /**
   * setup websocket stream and trail bull
   */
  run() {
    // subscribe to ticker prices
    const { symbol, interval, buffer } = this.config;
    let startTicker = null;
    let trailBull = null;
    let isListening = true;

    const channelName = `${symbol}@kline_${interval}`;
    const address = `wss://stream.binance.com:9443/ws/${channelName}`;
    const ws = new WebSocket(address);

    const onChange = (prev, curr) => {
      isListening = false;
      const profitLoss = getPercentDiff(this.startTicker.price, curr, 4) - Constants.TRADE_FEE;
      this.trader
        .updateStopLoss(curr)
        .then((order) => {
          log(
            `updated limitPrice: ${prev} -> ${order.price} = currentProfitloss: ${nicePercent(
              profitLoss
            )}`
          );
          isListening = true;
        })
        .catch(TradeBinance.abort);
    };

    ws.on('error', (err) => console.log('errored', err));
    ws.on('message', (response) => {
      const candle = new Candle(JSON.parse(response));
      if (startTicker === null) {
        startTicker = candle;
        trailBull = TrailBull({ startTicker, buffer, onChange });
      } else if (isListening) {
        const ticker = candle;
        const result = trailBull.update({ ticker });
        if (result.shouldContinue === false) {
          // initiate exit process
          this.exit();
        }
      }
    });
  }

  /**
   * handle exit process
   * notify when completed
   */
  exit() {
    this.notify(closingOrder);
  }

  notify(closingOrder) {
    // setup emailer
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const host = process.env.HOST;
    const emailer = Emailer({ username, password, host });

    // email results
    const startPrice = this.startTicker.price;
    const endPrice = result.ticker.price;
    const profitLoss = getPercentDiff(startPrice, endPrice, 4) - Constants.TRADE_FEE;
    const text = `  '${symbol.toUpperCase()}' trade exited with profitLoss of ${nicePercent(
      profitLoss
    )}
    startPrice: ${startPrice}
    endPrice: ${endPrice}
    buffer: ${buffer}`;

    log(text);

    emailer
      .send({
        to: 'solstice.sebastian@gmail.com',
        text,
      })
      .then(() => TradeBinance.end());
  }

  static end() {
    log(`Process ended successfully`);
    process.exit(1);
  }

  static abort(err) {
    if (err !== undefined) {
      log(`Process ended due to: ${err.message}`);
      throw new Error(err);
    }
  }
}

module.exports = TradeBinance;
