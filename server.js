require('dotenv').config();
const http = require('http');
const Constants = require('./common/constants.js');
const BinanceDashboard = require('./binance/dashboard.js');

const { requestMethods } = Constants;
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  if (url.includes('dashboard') === false || method !== requestMethods.GET) {
    res.statusCode = 404;
    res.end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  const dashboard = new BinanceDashboard();
  dashboard.fetch().then((data) => {
    res.write(JSON.stringify(data));
    res.end();
  });
});

server.listen(PORT);
