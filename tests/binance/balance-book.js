const test = require('tape');
const BinanceBalanceBook = require('../../binance/balance-book.js');
const Mocks = require('../../mocks/mocker.js');

test(`getFree`, (assert) => {
  const { balances } = Mocks();
  const balanceBook = new BinanceBalanceBook(balances);
  const free = balanceBook.getFree();
  assert.equal(free.length, 4);
  assert.equal(free.find((item) => item.symbol === 'BTC'), undefined, 'should not include BTC');

  assert.end();
});
