const test = require('tape');
const BinanceSymbolInfo = require('../../binance/symbol-info.js');
const Constants = require('@solstice.sebastian/constants');

const { filterTypes } = Constants.binance;

test(`normalizePrice`, (assert) => {
  const quotePrecision = 4;
  const filters = [
    {
      filterType: filterTypes.PRICE,
      minPrice: 2,
      maxPrice: 10,
      tickSize: 0.1,
    },
    { filterType: filterTypes.QUANTITY },
    { filterType: filterTypes.MIN_NOMINAL },
  ];
  const info = new BinanceSymbolInfo({ filters, quotePrecision });
  assert.equal(info.normalizePrice(2), 2);
  assert.equal(info.normalizePrice(0.5), 2);
  assert.equal(info.normalizePrice(2.4), 2.4);
  assert.equal(info.normalizePrice(2.45), 2.4);
  assert.end();
});

test(`normalizeQty`, (assert) => {
  const baseAssetPrecision = 4;
  const filters = [
    {
      filterType: filterTypes.PRICE,
      minPrice: 2,
      maxPrice: 10,
      tickSize: 0.1,
    },
    {
      filterType: filterTypes.QUANTITY,
      minQty: 2,
      maxQty: 10,
      stepSize: 0.1,
    },
    { filterType: filterTypes.MIN_NOMINAL },
  ];
  const info = new BinanceSymbolInfo({ filters, baseAssetPrecision });
  assert.equal(info.normalizeQty(2), 2);
  assert.equal(info.normalizeQty(0.5), 2);
  assert.equal(info.normalizeQty(2.4), 2.4);
  assert.equal(info.normalizeQty(2.45), 2.4);
  assert.end();
});
