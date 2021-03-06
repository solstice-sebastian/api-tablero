/**
 * @implements {Ticker}
 */
class BinanceCandle {
  constructor(data) {
    const candle = data.k;
    this.timestamp = data.E;
    this.symbol = candle.s;
    this.interval = candle.i;
    this.open = candle.o;
    this.close = candle.c;
    this.high = candle.h;
    this.low = candle.l;
    this.baseVolume = candle.v; // amount of BTC in candle
    this.takerBaseVolume = candle.V;
    this.numberOfTrades = candle.n;
    this.isClosed = candle.x;
    this.volume = candle.q;
    this.takerVolume = candle.Q;
  }

  get price() {
    return this.close;
  }
}

module.exports = BinanceCandle;
