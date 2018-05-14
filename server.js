require('dotenv').config();
const http = require('http');
const Constants = require('./common/constants.js');
const BinanceDashboard = require('./binance/dashboard.js');
const CoinigyTickerBook = require('./coinigy/ticker-book.js');
const MockTickerBook = require('./mocks/ticker-book.js');
const Emailer = require('./modules/emailer.js');
const commandLineArgs = require('command-line-args');

const cmdDefs = [{ name: 'mock', alias: 'm', type: Boolean }];
const cmdLineOptions = commandLineArgs(cmdDefs);

const { requestMethods } = Constants;
const PORT = process.env.PORT || 5000;
const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;
const host = process.env.EMAIL_HOST;
const recipient = process.env.EMAIL_RECIPIENT;

const tickerBook = cmdLineOptions.mock ? new MockTickerBook() : new CoinigyTickerBook();

const emailer = Emailer({ username, password, host });
emailer.setRecipient(recipient);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Content-Type', 'application/json');
  const { method, url } = req;

  if (url.includes('dashboard') && method === requestMethods.GET) {
    res.statusCode = 200;
    const dashboard = new BinanceDashboard();
    dashboard
      .fetch()
      .then(() => {
        res.write(dashboard.serialize());
        res.end();
      })
      .catch((err) => {
        console.log(`err:`, err);
      });
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
