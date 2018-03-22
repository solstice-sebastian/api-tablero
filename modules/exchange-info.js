const fetch = require('node-fetch');
const { namespace } = require('../private/config.js')();

const getExchangeInfo = () =>
  fetch(`${namespace}/api/v1/exchangeInfo`)
    .then((response) => response.json())
    .then((data) => data);

module.exports = getExchangeInfo;
