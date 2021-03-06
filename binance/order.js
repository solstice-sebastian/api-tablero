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

const Constants = require('@solstice.sebastian/constants');

const { orderStatuses, orderSides } = Constants.binance;

class BinanceOrder {
  constructor(data) {
    Object.assign(this, data, {
      timestamp: data.time,
    });
    if (this.isOpen) {
      this.qty = this.origQty;
    } else {
      this.qty = this.executedQty;
    }
  }

  isOpen() {
    return this.status === orderStatuses.NEW || this.status === orderStatuses.PARTIALLY_FILLED;
  }

  isBuy() {
    return this.side === orderSides.BUY;
  }

  isSell() {
    return this.side === orderSides.SELL;
  }

  isFilled() {
    return this.status === orderStatuses.FILLED;
  }

  isCancelled() {
    return this.status === orderStatuses.CANCELED;
  }

  // 'symbol | price | qty | status';
  log() {
    console.log(`${this.symbol} | ${this.price} | ${this.qty} | ${this.status}`);
  }
}

module.exports = BinanceOrder;
