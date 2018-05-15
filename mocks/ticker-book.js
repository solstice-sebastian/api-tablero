const CoinigyTickerBook = require('../coinigy/ticker-book.js');
const { fetch } = require('./tickers.js');

class MockTickerBook extends CoinigyTickerBook {
  getFavorites() {
    return Promise.resolve({
      data: fetch(),
    });
  }
}

module.exports = MockTickerBook;
