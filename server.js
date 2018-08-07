require('dotenv').config();
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const Constants = require('@solstice.sebastian/constants');
const https = require('https');
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
const { ALLOW_ORIGIN, RECORD_MANAGER_USER, RECORD_MANAGER_PWD, ENVIRONMENT } = process.env;

const tickerBook = cmdLineOptions.mock ? new MockTickerBook() : new CoinigyTickerBook();
const tradeRecordManager = new TradeRecordManager();

const app = express();
app.use(bodyParser.json());
const allowCrossDomain = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type,rando');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Accept', 'application/json');
  next();
};
app.use(allowCrossDomain);
const simpleAuth = (req, res, next) => {
  if (req.headers.origin !== ALLOW_ORIGIN) {
    try {
      const { username, password } = JSON.parse(req.headers.authorization);
      if (username === RECORD_MANAGER_USER && password === RECORD_MANAGER_PWD) {
        return next();
      }
      throw new Error('Record manager authorization failed');
    } catch (e) {
      if (req.headers.authorization === undefined) {
        throw new Error('credentials missing', e);
      }
      throw new Error('Record manager authorization failed', e);
    }
  } else {
    return next();
  }
};
app.use(simpleAuth);

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
    const latest = await tickerBook.fetch();
    const ticker = latest.getTicker(symbol);
    const coinigySymbol = ticker.mktName;
    const result = await adapter.addAlert({ price, symbol: coinigySymbol });
    console.log(`result:`, result);
    // fake return of data
    res.send({ notifications: { id: Math.floor(Math.random() * 100000) } });
  } catch (err) {
    res.send(err.message);
  }
});

app.get('/tickers', async (req, res) => {
  const latest = await tickerBook.fetch();
  res.send(latest.serialize());
});

app.post('/trade-record', async (req, res) => {
  const { ticker, strategy, trader } = req.body;
  const result = await tradeRecordManager.process({ ticker, strategy, trader });
  if (result instanceof Error) {
    return res.status(400).send(result);
  }
  return res.send(result);
});

app.put('/trade-record', async (req, res) => {
  const { ticker, strategy } = req.body;
  const result = await tradeRecordManager.update({ ticker, strategy });
  if (result instanceof Error) {
    return res.status(400).send(result);
  }
  return res.send(result);
});

app.get('/trade-record', async (req, res) => {
  const result = await tradeRecordManager.find({});
  return res.send(result);
});

app.delete('/trade-record', async (req, res) => {
  const { ticker } = req.body;
  const result = await tradeRecordManager.remove({ ticker });
  return res.send(result);
});

if (ENVIRONMENT !== Constants.environments.PRODUCTION) {
  const credentials = {
    key: fs.readFileSync('certs/server.key', 'utf8'),
    cert: fs.readFileSync('certs/server.crt', 'utf8'),
  };
  const server = https.createServer(credentials, app);
  server.listen(PORT);
} else {
  app.listen(PORT);
}

// const request = require('request');

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
// request.get(`https://localhost:${PORT}/dashboards`);
