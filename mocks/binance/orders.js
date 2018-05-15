const BinanceOrder = require('../../binance/order.js');
const { orderStatuses, orderSides } = require('../../common/constants.js').binance;

/**
 * open buys
 */
const openBuys = [
  new BinanceOrder({
    id: 6,
    status: orderStatuses.NEW,
    symbol: 'DASHBTC',
    timestamp: 48 * 2,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 7,
    status: orderStatuses.PARTIALLY_FILLED,
    symbol: 'DASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 8,
    status: orderStatuses.FILLED,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
  }),
];

/**
 * open sells
 */
const openSells = [
  new BinanceOrder({
    id: 9,
    status: orderStatuses.NEW,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.SELL,
  }),
  new BinanceOrder({
    id: 10,
    status: orderStatuses.NEW,
    symbol: 'XVGBTC',
    timestamp: 48 * 4,
    side: orderSides.SELL,
    price: 0.006, // 20% gain
  }),
];

/**
 * closed buys
 */
const closedBuys = [
  new BinanceOrder({
    id: 2,
    status: orderStatuses.FILLED,
    symbol: 'DASHBTC',
    timestamp: 23,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 3,
    status: orderStatuses.FILLED,
    symbol: 'DASHBTC',
    timestamp: 12,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 4,
    status: orderStatuses.FILLED,
    symbol: 'DASHBTC',
    timestamp: 48,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 11,
    status: orderStatuses.FILLED,
    symbol: 'NCASHBTC',
    timestamp: 4,
    side: orderSides.BUY,
  }),
  // lastBuyIn for ncash
  new BinanceOrder({
    id: 12,
    status: orderStatuses.FILLED,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
    price: 0.002,
  }),
  new BinanceOrder({
    id: 13,
    status: orderStatuses.CANCELED,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    // lastBuyIn for XVG
    id: 14,
    status: orderStatuses.FILLED,
    symbol: 'XVGBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
    price: 0.005,
  }),
];

/**
 * closed sells
 */
const closedSells = [
  new BinanceOrder({
    id: 1,
    status: orderStatuses.FILLED,
    symbol: 'DASHBTC',
    timestamp: 42,
    side: orderSides.SELL,
  }),
  new BinanceOrder({
    id: 5,
    status: orderStatuses.FILLED,
    symbol: 'DASHBTC',
    timestamp: 77,
    side: orderSides.SELL,
  }),
];

const orders = [...openBuys, ...openSells, ...closedBuys, ...closedSells];

module.exports = () => orders;
