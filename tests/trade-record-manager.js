require('dotenv').config();
const test = require('tape');
const TradeRecordManager = require('../modules/trade-record-manager.js');
const { modByPercent } = require('@solstice.sebastian/helpers')();
const Constants = require('@solstice.sebastian/constants');

const { ENTERED } = Constants.botStates;

const collectionName = 'test_manager';
const manager = new TradeRecordManager({ collectionName });

const entryTicker = {
  symbol: 'NCASHBTC',
  price: '0.00000042',
};

const strategy = {
  trailBuffer: -0.02,
  startTicker: entryTicker,
  startPrice: entryTicker.price,
  symbol: entryTicker.symbol,
  limitPrice: modByPercent(+entryTicker.price, -0.02).toFixed(8),
  limitChanges: 0,
};

const trader = {
  entryOrder: null,
  exitOrder: null,
  botState: ENTERED,
};

test(`add`, async (t) => {
  t.plan(4);
  await manager.clear();
  const result = await manager.add({ ticker: entryTicker, strategy, trader });
  t.deepEqual(result.ticker, entryTicker, 'entry ticker');
  t.deepEqual(result.strategy, strategy, 'entry strategy');
  t.deepEqual(result.trader, trader, 'entry trader');
  t.equal(trader.botState, ENTERED, 'should be entered');
  t.end();
});

test('update', async (t) => {
  t.plan(3);
  await manager.clear();
  await manager.add({ ticker: entryTicker, strategy, trader });
  const newStrategy = Object.assign({}, strategy, { limitPrice: 42 });
  await manager.update({ ticker: entryTicker, strategy: newStrategy });
  const result = await manager.find({ symbol: entryTicker.symbol });
  t.deepEqual(result[0].ticker, entryTicker);
  t.deepEqual(result[0].trader, trader);
  t.deepEqual(result[0].strategy, newStrategy);
  t.end();
});

test('remove', async (t) => {
  t.plan(1);
  await manager.clear();
  await manager.add({ ticker: entryTicker, strategy, trader });
  const result = await manager.remove({ ticker: entryTicker });
  t.deepEqual(result.deletedCount, 1);
  t.end();
});

setTimeout(() => {
  process.exit(0);
}, 3000);
