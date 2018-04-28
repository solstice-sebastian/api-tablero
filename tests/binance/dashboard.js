const test = require('tape');
const BinanceDashboard = require('../../binance/dashboard.js');
const BinanceOrder = require('../../binance/order.js');
const BinanceBalanceBook = require('../../binance/balance-book.js');
const BinanceOrderBook = require('../../binance/order-book.js');
const Mocks = require('../../mocks/mocks.js');

/**
 * BinanceDashboardAsset
 * { asset, lastBuyIn, currentPrice, currentProfitLoss, openOrders }
 */
test(`build`, (assert) => {
  assert.plan(4);
  const asset = 'NCASH';
  const base = 'BTC';
  const { orders, balances, indexedTickers } = Mocks();
  const balanceBook = new BinanceBalanceBook(balances);
  const orderBook = new BinanceOrderBook(orders);
  const dashboard = new BinanceDashboard({ base });
  const result = dashboard.build({ balanceBook, orderBook, indexedTickers });
  const dashboardAsset = result[asset];
  assert.equal(dashboardAsset.lastBuyIn.constructor, BinanceOrder);
  const currentProfitLoss = 0.55; // 0.002 -> 0.0031 = 55% increase
  assert.equal(dashboardAsset.currentPrice, 0.0031);
  assert.equal(dashboardAsset.currentProfitLoss, currentProfitLoss);
  assert.equal(dashboardAsset.openOrders.length, 1);
  assert.end();
});

test(`build with open orders`, (assert) => {
  assert.plan(5);
  const asset = 'XVG';
  const base = 'BTC';
  const { orders, balances, indexedTickers } = Mocks();
  const balanceBook = new BinanceBalanceBook(balances);
  const orderBook = new BinanceOrderBook(orders);
  const dashboard = new BinanceDashboard({ base });
  const result = dashboard.build({ balanceBook, orderBook, indexedTickers });
  const dashboardAsset = result[asset];
  assert.equal(dashboardAsset.lastBuyIn.constructor, BinanceOrder);
  const currentProfitLoss = 0.3; // 30%
  assert.equal(dashboardAsset.currentPrice, 0.0065);
  assert.equal(dashboardAsset.currentProfitLoss, currentProfitLoss);
  assert.equal(dashboardAsset.openOrders.length, 1);
  assert.equal(dashboardAsset.openOrders[0].lockedProfitLoss, 0.2);
  assert.end();
});
