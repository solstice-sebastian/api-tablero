/**
 * makes trades
 * should follow an interface to work with multiple exchanges
 * @interface
 * @method enter
 * @method exit
 * @param namespace
 * @param endpoints for the require methods
 */
const TradeEngine = () => {
  // const API_SECRET = process.env.API_SECRET;
  const headers = {
    'X-MBX-APIKEY': process.env.API_KEY,
  };

  const enter = () => {};
  const exit = () => {};
  return { exit, enter };
};

module.exports = TradeEngine;
