const BinanceOrder = require('../../binance/order.js');
const { statuses, orderSides } = require('../../common/constants.js').binance;

/**
 * open buys
 */
const openBuys = [
  new BinanceOrder({
    id: 6,
    status: statuses.order.NEW,
    symbol: 'DASHBTC',
    timestamp: 48 * 2,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 7,
    status: statuses.order.PARTIALLY_FILLED,
    symbol: 'DASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 8,
    status: statuses.order.FILLED,
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
    status: statuses.order.NEW,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.SELL,
  }),
  new BinanceOrder({
    id: 10,
    status: statuses.order.NEW,
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
    status: statuses.order.FILLED,
    symbol: 'DASHBTC',
    timestamp: 23,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 3,
    status: statuses.order.FILLED,
    symbol: 'DASHBTC',
    timestamp: 12,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 4,
    status: statuses.order.FILLED,
    symbol: 'DASHBTC',
    timestamp: 48,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    id: 11,
    status: statuses.order.FILLED,
    symbol: 'NCASHBTC',
    timestamp: 4,
    side: orderSides.BUY,
  }),
  // lastBuyIn for ncash
  new BinanceOrder({
    id: 12,
    status: statuses.order.FILLED,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
    price: 0.002,
  }),
  new BinanceOrder({
    id: 13,
    status: statuses.order.CANCELED,
    symbol: 'NCASHBTC',
    timestamp: 48 * 4,
    side: orderSides.BUY,
  }),
  new BinanceOrder({
    // lastBuyIn for XVG
    id: 14,
    status: statuses.order.FILLED,
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
    status: statuses.order.FILLED,
    symbol: 'DASHBTC',
    timestamp: 42,
    side: orderSides.SELL,
  }),
  new BinanceOrder({
    id: 5,
    status: statuses.order.FILLED,
    symbol: 'DASHBTC',
    timestamp: 77,
    side: orderSides.SELL,
  }),
];

const orders = [...openBuys, ...openSells, ...closedBuys, ...closedSells];

module.exports = () => orders;
