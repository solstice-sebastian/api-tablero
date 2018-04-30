const test = require('tape');
const BinanceBalanceBook = require('../../binance/balance-book.js');
const BinanceTickerBook = require('../../binance/ticker-book.js');
const Mocks = require('../../mocks/mocks.js');

test(`getActive`, (assert) => {
  const { balances, tickers } = Mocks();
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  const active = balanceBook.getActive(tickerBook);
  assert.equal(active.length, 6);
  assert.equal(active.every((item) => item.free > 0 || item.locked > 0), true);
  assert.end();
});
