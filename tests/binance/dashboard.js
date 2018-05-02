const test = require('tape');
const BinanceDashboard = require('../../binance/dashboard.js');
const BinanceOrder = require('../../binance/order.js');
const BinanceBalanceBook = require('../../binance/balance-book.js');
const BinanceOrderBook = require('../../binance/order-book.js');
const BinanceTickerBook = require('../../binance/ticker-book.js');
const Mocks = require('../../mocks/mocks.js');

/**
 * BinanceDashboardAsset
 * { asset, lastBuyIn, currentPrice, currentProfitLoss, openOrders }
 */
test(`build`, (assert) => {
  assert.plan(5);
  const asset = 'NCASH';
  const base = 'BTC';
  const { orders, balances, tickers } = Mocks();
  const orderBook = new BinanceOrderBook(orders);
  const dashboard = new BinanceDashboard(base);
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  balanceBook.activeAssets = balanceBook.getActiveAssets(tickerBook);
  const result = dashboard.build({ balanceBook, orderBook, tickerBook });
  const dashboardAsset = result.find((x) => x.asset === asset);
  assert.equal(dashboardAsset.lastBuyIn.constructor, BinanceOrder);
  const currentProfitLoss = 0.55; // 0.002 -> 0.0031 = 55% increase
  assert.equal(dashboardAsset.currentPrice, 0.0031);
  assert.equal(dashboardAsset.currentProfitLoss, currentProfitLoss);
  assert.equal(dashboardAsset.openOrders.length, 1);
  // find mock balance
  const mockBalance = balances.find((x) => x.asset === asset);
  assert.equal(dashboardAsset.balance.qty, mockBalance.qty, 'correct qty');
  assert.end();
});

test.only(`build with open orders`, (assert) => {
  assert.plan(5);
  const asset = 'XVG';
  const base = 'BTC';
  const { orders, balances, tickers } = Mocks();
  const orderBook = new BinanceOrderBook(orders);
  const dashboard = new BinanceDashboard(base);
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  balanceBook.activeAssets = balanceBook.getActiveAssets(tickerBook);
  const result = dashboard.build({ balanceBook, orderBook, tickerBook });
  const dashboardAsset = result.find((x) => x.asset === asset);
  assert.equal(dashboardAsset.lastBuyIn.constructor, BinanceOrder);
  const currentProfitLoss = 0.3; // 30%
  assert.equal(dashboardAsset.currentPrice, 0.0065);
  assert.equal(dashboardAsset.currentProfitLoss, currentProfitLoss);
  assert.equal(dashboardAsset.openOrders.length, 1);
  assert.equal(dashboardAsset.openOrders[0].lockedProfitLoss, 0.2);
  assert.end();
});
