const Balance = require('../models/balance.js');

class BinanceBalance extends Balance {
  constructor(data) {
    const { asset } = data;
    const free = +data.free;
    const locked = +data.locked;
    const qty = free + locked;
    super({ asset, free, locked, qty });
  }
}

module.exports = BinanceBalance;
