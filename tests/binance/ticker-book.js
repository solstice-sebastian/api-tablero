const test = require('tape');
const BinanceTickerBook = require('../../binance/ticker-book.js');
const Mocks = require('../../mocks/mocks.js');

test(`getSymbol`, (assert) => {
  const { tickers } = Mocks();
  const tickerBook = new BinanceTickerBook().init(tickers);
  const symbol = 'NCASHBTC';
  const expected = tickers.find((ticker) => ticker.symbol === symbol);
  const actual = tickerBook.getSymbol(symbol);
  assert.equal(actual.symbol, expected.symbol);
  assert.equal(actual.price, expected.price);
  assert.end();
});

test(`getBase`, (assert) => {
  const { tickers } = Mocks();
  const tickerBook = new BinanceTickerBook().init(tickers);
  const symbol = 'BTCUSDT';
  const base = 'USDT';
  const expected = tickers.find((ticker) => ticker.symbol === symbol);
  const actual = tickerBook.getBase(base);
  assert.equal(actual.length, 1);
  assert.equal(actual[0].symbol, expected.symbol);
  assert.equal(actual[0].price, expected.price);
  assert.end();
});

test(`getAsset`, (assert) => {
  const { tickers } = Mocks();
  const tickerBook = new BinanceTickerBook().init(tickers);
  const asset = 'NCASH';
  const actual = tickerBook.getAsset(asset);
  assert.equal(actual.length, 2);
  assert.equal(actual[0].symbol.startsWith(asset), true);
  assert.equal(actual[1].symbol.startsWith(asset), true);
  assert.end();
});

test(`getUsdValue`, (assert) => {
  const usdPrice = 1200;
  const assetPrice = 0.012;
  const tickers = [{ symbol: 'BTCUSDT', price: usdPrice }, { symbol: 'LTCBTC', price: assetPrice }];
  const tickerBook = new BinanceTickerBook().init(tickers);
  const symbol = 'LTCBTC';
  const actual = tickerBook.getUsdValue(symbol);
  const expected = usdPrice * assetPrice;
  assert.equal(actual, expected);
  assert.end();
});
