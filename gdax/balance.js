const Balance = require('../models/balance.js');

/**
 * {
 *    "id": "71452118-efc7-4cc4-8780-a5e22d4baa53",
 *    "currency": "BTC",
 *    "balance": "0.0000000000000000",
 *    "available": "0.0000000000000000",
 *    "hold": "0.0000000000000000",
 *    "profile_id": "75da88c5-05bf-4f54-bc85-5c775bd68254"
 *},
 */
class GdaxBalance extends Balance {
  constructor(data) {
    const asset = data.currency;
    const free = +data.available;
    const locked = +data.hold;
    const qty = data.balance;
    super({ asset, free, locked, qty });
  }

  isActive() {
    return this.qty > 0;
  }
}

module.exports = GdaxBalance;
