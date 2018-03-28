const fs = require('fs');
const { datetime } = require('./helpers.js')();

const Logger = (logFile = 'trade.log') => {
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, `${datetime()}: ${msg}\n`);
  };

  return { log };
};

module.exports = Logger;
