const test = require('tape');
const TradeRecordManager = require('../modules/trade-record-manager.js');
const { modByPercent } = require('@solstice.sebastian/helpers')();
const Constants = require('@solstice.sebastian/constants');

const { ENTERED, EXITED } = Constants.botStates;

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

test.only(`add`, async (t) => {
  t.plan(3);
  const result = await manager.add({ ticker: entryTicker, strategy, trader });
  t.deepEqual(result.ticker, entryTicker, 'entry ticker');
  t.deepEqual(result.strategy, strategy, 'entry strategy');
  t.deepEqual(result.trader, trader, 'entry trader');
  t.equal(trader.botState, ENTERED, 'should be entered');
  t.end();
});
