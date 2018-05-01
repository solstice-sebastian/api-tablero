const test = require('tape');
const BinanceBalanceBook = require('../../binance/balance-book.js');
const BinanceTickerBook = require('../../binance/ticker-book.js');
const Mocks = require('../../mocks/mocks.js');

test(`getActive`, (assert) => {
  const { balances, tickers } = Mocks();
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  const active = balanceBook.getActive(tickerBook);
  assert.equal(balanceBook.balances.length, balances.length);
  assert.equal(active.length, 6, 'should have correct number of active');
  assert.equal(active.every((item) => item.free > 0 || item.locked > 0), true);
  assert.end();
});

test(`getActiveAssets`, (assert) => {
  const { balances, tickers } = Mocks();
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  const activeAssets = balanceBook.getActiveAssets(tickerBook);
  const active = balanceBook.getActive(tickerBook);
  assert.equal(balanceBook.balances.length, balances.length);
  assert.equal(activeAssets.length, 6, 'should have correct number of activeAssets');
  assert.deepEqual(activeAssets, active.map((item) => item.asset));
  assert.end();
});
