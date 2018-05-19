const test = require('tape');
const BinanceDashboard = require('../../binance/dashboard.js');
const BinanceOrder = require('../../binance/order.js');
const BinanceBalanceBook = require('../../binance/balance-book.js');
const BinanceOrderHistory = require('../../binance/order-history.js');
const BinanceTickerBook = require('../../binance/ticker-book.js');
const Mocks = require('../../mocks/mocks.js');

/**
 * BinanceDashboardAsset
 * { lastBuyIn, currentPrice, openOrders }
 */
test(`build`, (assert) => {
  const asset = 'NCASH';
  const base = 'BTC';
  const { orders, balances, tickers } = Mocks();
  const orderHistory = new BinanceOrderHistory(orders);
  const dashboard = new BinanceDashboard(base);
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  balanceBook.activeAssets = balanceBook.getActiveAssets(tickerBook);
  const result = dashboard.build({ balanceBook, orderHistory, tickerBook });
  const dashboardAsset = result.find((x) => x.asset === asset);
  assert.equal(dashboardAsset.lastBuyIn.constructor, BinanceOrder);
  assert.equal(dashboardAsset.currentPrice, 0.0031);
  assert.equal(dashboardAsset.openOrders.length, 1);
  // find mock balance
  const mockBalance = balances.find((x) => x.asset === asset);
  assert.equal(dashboardAsset.balance.qty, mockBalance.qty, 'correct qty');
  assert.end();
});

test(`build with open orders`, (assert) => {
  const asset = 'XVG';
  const base = 'BTC';
  const { orders, balances, tickers } = Mocks();
  const orderHistory = new BinanceOrderHistory(orders);
  const dashboard = new BinanceDashboard(base);
  const tickerBook = new BinanceTickerBook().init(tickers);
  const balanceBook = new BinanceBalanceBook(balances);
  balanceBook.activeAssets = balanceBook.getActiveAssets(tickerBook);
  const result = dashboard.build({ balanceBook, orderHistory, tickerBook });
  const dashboardAsset = result.find((x) => x.asset === asset);
  assert.equal(dashboardAsset.lastBuyIn.constructor, BinanceOrder);
  assert.equal(dashboardAsset.currentPrice, 0.0065);
  assert.equal(dashboardAsset.openOrders.length, 1);
  assert.end();
});
