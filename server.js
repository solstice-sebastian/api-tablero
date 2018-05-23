require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
// const Constants = require('./common/constants.js');
const BinanceDashboard = require('./binance/dashboard.js');
const GdaxDashboard = require('./gdax/dashboard.js');
const CoinigyTickerBook = require('./coinigy/ticker-book.js');
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
  try {
    const gdaxDashboard = await new GdaxDashboard().fetch();
    // const response = serializeDashboards([gdaxDashboard]);
    const binanceDashboard = await new BinanceDashboard().fetch();
    const response = serializeDashboards([binanceDashboard, gdaxDashboard]);
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
    // fake return of data
    res.send({ notifications: { id: Math.floor(Math.random() * 100000) } });
  } catch (err) {
    res.send(err.message);
  }
});

app.get('/tickers', () => tickerBook.serialize());

tickerBook.poll();
app.listen(PORT);

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
