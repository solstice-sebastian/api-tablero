require('dotenv').config();
const http = require('http');
const Constants = require('./common/constants.js');
const BinanceDashboard = require('./binance/dashboard.js');
const CoinigyTickerBook = require('./coinigy/ticker-book.js');
const Analytic = require('./modules/sma-analytic.js');
const Emailer = require('./modules/emailer.js');

const { requestMethods } = Constants;
const PORT = process.env.PORT || 5000;
const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;
const host = process.env.EMAIL_HOST;
const recipient = process.env.EMAIL_RECIPIENT;

const tickerBook = new CoinigyTickerBook();
const emailer = Emailer({ username, password, host });
emailer.setRecipient(recipient);

const PRICE_THRESHOLD = 0.03; // 3%
const VOLUME_THRESHOLD = 0.03; // 3%
const BASE_VOLUME_THRESHOLD = 0.03; // 3%

const analytics = [
  new Analytic({
    threshold: PRICE_THRESHOLD,
    smaKey: 'priceSma',
    valueKey: 'price',
    emailer,
  }),
  new Analytic({
    threshold: VOLUME_THRESHOLD,
    smaKey: 'volumeSma',
    valueKey: 'volume',
    emailer,
  }),
  new Analytic({
    threshold: BASE_VOLUME_THRESHOLD,
    smaKey: 'baseVolumeSma',
    valueKey: 'baseVolume',
    emailer,
  }),
];

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

const callback = (tb) => {
  analytics.forEach((analytic) => {
    analytic.analyze(tb);
  });
};

tickerBook.poll({ callback });
server.listen(PORT);

// const url = 'http://localhost:3000/dashboards';
// http.get(url);

// test email
// const testEmailer = Emailer({ username, password, host });
// testEmailer.setRecipient('aric.allen2@gmail.com');
// testEmailer.send({
//   // to: 'bujurasta2@gmail.com',
//   text: 'hello!',
// });
