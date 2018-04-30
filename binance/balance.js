class BinanceBalance {
  constructor(data) {
    this.asset = data.asset;
    this.free = +data.free;
    this.locked = +data.locked;
    this.qty = this.free + this.locked;
  }
}

module.exports = BinanceBalance;
