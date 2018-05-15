class Balance {
  /**
   * @param {String} asset
   * @param {Number} free
   * @param {Number} locked
   */
  constructor({ asset, free, locked, qty }) {
    this.asset = asset;
    this.free = +free;
    this.locked = +locked;
    this.qty = qty === undefined ? this.free + this.locked : qty;
  }

  toString() {
    return `${this.asset} | ${this.qty} | ${this.free} | ${this.locked}`;
  }
}

module.exports = Balance;
