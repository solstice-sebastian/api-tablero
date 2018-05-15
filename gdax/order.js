const Constants = require('../common/constants.js');

const { liquidity, orderSides } = Constants.gdax;
/**
 * {
 *     "id": "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
 *     "price": "0.10000000",
 *     "size": "0.01000000",
 *     "product_id": "BTC-USD",
 *     "side": "buy",
 *     "stp": "dc",
 *     "type": "limit",
 *     "time_in_force": "GTC",
 *     "post_only": false,
 *     "created_at": "2016-12-08T20:02:28.53864Z",
 *     "fill_fees": "0.0000000000000000",
 *     "filled_size": "0.00000000",
 *     "executed_value": "0.0000000000000000",
 *     "status": "open",
 *     "settled": false
 * },
 */
class GdaxOrder {
  constructor(data) {
    this.id = data.id;
    this.orderId = data.order_id;
    this.productId = data.product_id;
    this.createAt = data.created_at;
    this.price = data.price;
    this.size = data.size;
    this.side = data.side;
    this.type = data.type;
    this.timeInForce = data.time_in_force;
    this.postOnly = data.post_only;
    this.fillFees = data.fill_fees;
    this.filledSize = data.filled_size;
    this.executedValue = data.executed_value;
    this.settled = data.settled;
    this.status = data.status;


    // ticker
    this.symbol = this.productId.replace('-', '');
    this.timestamp = new Date(data.created_at).getTime();

    // fills specific;
    this.fee = data.fee;
    this.tradeId = data.trade_id;
    this.liquidity = data.liquidity; // maker or taker
  }

  isFilled() {
    return this.tradeId !== undefined;
  }

  isMaker() {
    return this.liquidity === liquidity.MAKER;
  }

  isTaker() {
    return this.liquidity === liquidity.TAKER;
  }

  isBuy() {
    return this.side === orderSides.BUY;
  }

  isSell() {
    return this.side === orderSides.SELL;
  }

  isOpen() {
    return this.isFilled() === false;
  }

  getAsset() {
    return this.productId.replace(/-.+/g, '');
  }
}

module.exports = GdaxOrder;
