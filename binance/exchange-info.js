const fetch = require('node-fetch');
const Constants = require('../common/constants.js');
const BinanceSymbolInfo = require('./symbol-info.js');

/**
 * wrapper to hold all exchange info including an array of BinanceSymbolInfo
 * can either pass in data from /exchangeInfo or call `load`
 */
class BinanceExchangeInfo {
  constructor(data) {
    if (data !== undefined) {
      this.init(data);
    }
  }

  init(data) {
    Object.assign(this, data);
    this.symbolInfos = this.symbols.map((symbolInfo) => new BinanceSymbolInfo(symbolInfo));
  }

  load() {
    fetch(Constants.binance.endpoints.GET_EXCHANGE_INFO).then((data) => this.init(data));
  }

  // async getLargeAssets() {
  //   if (this._largeAssets !== null) {
  //     return new Promise((res, rej) => {
  //       fetch(Constants.binance.endpoints.GET_TICKER).then((tickers) => {
  //         this._largeAssets = tickers
  //           .filter((ticker) => ticker.price >= getBtcUsd())
  //           .map((ticker) => ticker.symbol);
  //       });
  //     });
  //   }
  //   return Promise.resolve(this._largeAssets);
  // }

  getSymbolInfo(symbol) {
    return this.symbolInfos.find(
      (symbolInfo) => symbolInfo.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }
}

module.exports = BinanceExchangeInfo;
