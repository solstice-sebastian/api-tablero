require('dotenv').config();
const http = require('http');
const Constants = require('./common/constants.js');
const BinanceDashboard = require('./binance/dashboard.js');
const GdaxDashboard = require('./gdax/dashboard.js');
const CoinigyTickerBook = require('./coinigy/ticker-book.js');
const MockTickerBook = require('./mocks/ticker-book.js');
const commandLineArgs = require('command-line-args');
const serializeDashboards = require('./serializers/dashboard.js');

const cmdDefs = [{ name: 'mock', alias: 'm', type: Boolean }];
const cmdLineOptions = commandLineArgs(cmdDefs);

const { requestMethods } = Constants;
const PORT = process.env.PORT || 5000;

const tickerBook = cmdLineOptions.mock ? new MockTickerBook() : new CoinigyTickerBook();

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Content-Type', 'application/json');
  const { method, url } = req;

  if (url.includes('dashboard') && method === requestMethods.GET) {
    res.statusCode = 200;
    try {
      const gdaxDashboard = await new GdaxDashboard().fetch();
      // const response = serializeDashboards([gdaxDashboard]);
      const binanceDashboard = await new BinanceDashboard().fetch();
      const response = serializeDashboards([binanceDashboard, gdaxDashboard]);
      res.write(response);
      res.end();
    } catch (err) {
      res.write(err.message);
      res.end();
    }
  } else if (url.includes('tickers') && method === requestMethods.GET) {
    res.statusCode = 200;
    res.write(tickerBook.serialize());
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

tickerBook.poll();
server.listen(PORT);

// testing
http.get(`http://localhost:${PORT}/dashboards`);
