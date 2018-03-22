const test = require('tape');
const TradePair = require('../models/trade-pair.js');
const TrailAutoResult = require('../models/trail-auto-result.js');

test(`getTimeBetween`, (assert) => {
  const entry = new TrailAutoResult({ ticker: { timestamp: '2018-03-09_14:42:56' } });
  const exit = new TrailAutoResult({ ticker: { timestamp: '2018-03-09_14:43:00' } }); // 4 seconds later
  const tradePair = new TradePair({ entry, exit });
  let isSeconds = false;
  let timeBetween = tradePair.getTimeBetween(isSeconds);
  assert.equal(timeBetween, 4 * 1000);

  isSeconds = true;
  timeBetween = tradePair.getTimeBetween(isSeconds);
  assert.equal(timeBetween, 4);
  assert.end();
});