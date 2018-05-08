require('dotenv').config();
const http = require('http');
const Constants = require('./common/constants.js');
const BinanceDashboard = require('./binance/dashboard.js');
const BinanceAdapter = require('./binance/ticker-book.js');
const BinanceTickerBook = require('./binance/ticker-book.js');

const { requestMethods } = Constants;
const PORT = process.env.PORT || 5000;
const binanceAdapter = new BinanceAdapter();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Content-Type', 'application/json');
  const { method, url } = req;

  if (url.includes('dashboard') && method === requestMethods.GET) {
    res.statusCode = 200;
    const dashboard = new BinanceDashboard();
    dashboard
      .fetch()
      .then((data) => {
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch((err) => console.log(`err:`, err));
  } else if (url.includes('tickers') && method === requestMethods.GET) {
    res.statusCode = 200;
    const binanceTickerBook = new BinanceTickerBook();
    binanceTickerBook
      .load(binanceAdapter)
      .then((tickerBook) => {
        res.write(tickerBook.serialize());
        res.end();
      })
      .catch((err) => console.log(`err:`, err));
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT);
