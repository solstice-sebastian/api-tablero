const Constants = require('@solstice.sebastian/constants');

const Helpers = () => {
  const getDefaults = (overrides) => {
    return Object.assign(
      {},
      {
        timestamp: Date.now(),
        timeInForce: Constants.binance.timeInForce.GOOD_TIL_CANCELED,
        recvWindow: 1000 * 60,
      },
      overrides
    );
  };

  return { getDefaults };
};

module.exports = Helpers;
