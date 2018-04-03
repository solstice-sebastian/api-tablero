const Constants = require('../common/constants.js');

const Helpers = () => {
  const getDefaults = (overrides) => {
    return Object.assign(
      {},
      {
        timestamp: Date.now(),
        timeInForce: Constants.binance.timeInForce.GOOD_TIL_CANCELED,
        recvWindow: 2500,
      },
      overrides
    );
  };

  return { getDefaults };
};

module.exports = Helpers;
