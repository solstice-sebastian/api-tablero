require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
// const Constants = require('@solstice.sebastian/constants');
const BinanceDashboard = require('./binance/dashboard.js');
const GdaxDashboard = require('./gdax/dashboard.js');
const CoinigyTickerBook = require('./coinigy/ticker-book.js');
const TradeRecordManager = require('./modules/trade-record-manager.js');
const CoinigyAdapter = require('./coinigy/adapter.js');
const MockTickerBook = require('./mocks/ticker-book.js');
const commandLineArgs = require('command-line-args');
const serializeDashboards = require('./serializers/dashboard.js');

const cmdDefs = [{ name: 'mock', alias: 'm', type: Boolean }];
const cmdLineOptions = commandLineArgs(cmdDefs);

// const { requestMethods } = Constants;
const PORT = process.env.PORT || 5000;
const { ALLOW_ORIGIN } = process.env;

const tickerBook = cmdLineOptions.mock ? new MockTickerBook() : new CoinigyTickerBook();
const tradeRecordManager = new TradeRecordManager();

const app = express();
const allowCrossDomain = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json());

app.get('/dashboards', async (req, res) => {
  const dashboards = [];
  try {
    const gdaxDashboard = await new GdaxDashboard().fetch();
    dashboards.push(gdaxDashboard);
    const binanceDashboard = await new BinanceDashboard().fetch();
    dashboards.push(binanceDashboard);
    const response = serializeDashboards(dashboards);
    res.send(response);
  } catch (err) {
    res.send(err.message);
  }
});

app.post('/notifications', async (req, res) => {
  const adapter = new CoinigyAdapter();
  try {
    const { symbol, price } = req.body.notification;
    const ticker = tickerBook.getTicker(symbol);
    const coinigySymbol = ticker.mktName;
    const result = await adapter.addAlert({ price, symbol: coinigySymbol });
    console.log(`result:`, result);
    // fake return of data
    res.send({ notifications: { id: Math.floor(Math.random() * 100000) } });
  } catch (err) {
    res.send(err.message);
  }
});

app.get('/tickers', () => tickerBook.serialize());

app.post('/trade-order', async (req, res) => {
  const { ticker, strategy, trader } = req.body;
  const result = await tradeRecordManager.process({ ticker, strategy, trader });
  if (result instanceof Error) {
    return res.status(400).send(result);
  }
  return res.send(result);
});

tickerBook.poll();
// app.listen(PORT);
app.listen(3042);

// testing
// const symbol = 'NCASHBTC';
// const price = 0.00000405;
// const body = { symbol, price };
// const url = `http://localhost:${PORT}/notifications`;
// const options = {
//   method: 'POST',
//   url,
//   json: true,
//   body,
// };
// request.post(options);

// force dashboard
// request.get({ url: `http://localhost:${PORT}/dashboards` });
