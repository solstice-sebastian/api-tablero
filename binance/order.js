/**
 * {
 *  "symbol": "DASHBTC",
 *  "orderId": 16984706,
 *  "clientOrderId": "web_4a6f4e7965684ba68d8e41417b49494d",
 *  "price": "0.03734500",
 *  "origQty": "2.22000000",
 *  "executedQty": "0.00000000",
 *  "status": "NEW",
 *  "timeInForce": "GTC",
 *  "type": "STOP_LOSS_LIMIT",
 *  "side": "SELL",
 *  "stopPrice": "0.03735100",
 *  "icebergQty": "0.00000000",
 *  "time": 1521820740516,
 *  "isWorking": false
 * }
 */

const orderStatuses = require('../common/constants.js').binance.statuses.order;

class BinanceOrder {
  constructor(data) {
    Object.assign(this, data);
  }

  isOpen() {
    return this.status === orderStatuses.NEW || this.status === orderStatuses.PARTIALLY_FILLED;
  }
}

module.exports = BinanceOrder;
