const test = require('tape');
const BinanceSymbolInfo = require('../../binance/symbol-info.js');
const Constants = require('../../common/constants.js');

const { filterTypes } = Constants.binance;

test(`normalizePrice`, (assert) => {
  const filters = [
    {
      filterType: filterTypes.PRICE,
      minPrice: 2,
      maxPrice: 10,
      tickSize: 0.1,
    },
  ];
  const info = new BinanceSymbolInfo({ filters });
  assert.equal(info.normalizePrice(2), 2);
  assert.equal(info.normalizePrice(0.5), 2);
  assert.equal(info.normalizePrice(2.4), 2.4);
  assert.equal(info.normalizePrice(2.45), 2.4);
  assert.end();
});

test(`normalizeQty`, (assert) => {
  const filters = [
    {
      filterType: filterTypes.LOT_SIZE,
      minQty: 2,
      maxQty: 10,
      stepSize: 0.1,
    },
  ];
  const info = new BinanceSymbolInfo({ filters });
  assert.equal(info.normalizeQty(2), 2);
  assert.equal(info.normalizeQty(0.5), 2);
  assert.equal(info.normalizeQty(2.4), 2.4);
  assert.equal(info.normalizeQty(2.45), 2.4);
  assert.end();
});
