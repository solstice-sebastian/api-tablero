/**
 * handles the data structure returned by `getBalances`
 */
class BinanceBalances {
  constructor(balances) {
    this.balances = balances
      .filter((coins) => +coins.free > 0)
      .map(({ asset, free, locked }) => ({ symbol: asset, free: +free, locked: +locked }))
      .sort((a, b) => (+a.free < +b.free ? 1 : -1));
  }

  getBySymbol(symbol) {
    return this.balances.find((item) => item.symbol === symbol);
  }
}

module.exports = BinanceBalances;
