const emailjs = require('emailjs');
const { datetime } = require('../common/helpers.js')();

const Emailer = ({ username, password, host, ssl = true }) => {
  if (username === undefined || password === undefined || host === undefined) {
    throw new Error('Emailer missing parameters');
  }

  const server = emailjs.server.connect({
    user: username,
    password,
    host,
    ssl,
  });

  /**
   * @param {String=} text
   * @param {String=} from
   * @param {String} to
   * @param {String=} subject
   * @param {Array<Any>} attachment
   */
  const send = ({
    text = 'email from mi-simulador',
    from = 'mi-simulador@gmail.com',
    to,
    subject = `MiSimulador update ${datetime()}`,
    attachment = [],
  }) =>
    new Promise((res, rej) => {
      server.send({ text, from, to, subject, attachment }, (err, message) => {
        if (err) {
          rej(err);
        } else {
          res(message);
        }
      });
    });

  return { send };
};

module.exports = Emailer;
