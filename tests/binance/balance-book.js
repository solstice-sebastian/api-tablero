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

test(`getLocked`, (assert) => {
  const { balances } = Mocks();
  const balanceBook = new BinanceBalanceBook(balances);
  const locked = balanceBook.getLocked();
  const lockedAssets = locked.map((x) => x.asset);
  assert.equal(locked.length, 2);
  assert.deepEqual(lockedAssets, ['XVG', 'XLM']);
  assert.end();
});

test(`getActive`, (assert) => {
  const { balances } = Mocks();
  const balanceBook = new BinanceBalanceBook(balances);
  const active = balanceBook.getActive();
  assert.equal(active.length, 6);
  assert.equal(active.every((item) => item.free > 0 || item.locked > 0), true);
  assert.end();
});
