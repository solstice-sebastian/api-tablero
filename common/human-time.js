const Constants = require('./constants.js');
/**
 * GOAL: console.log(HumanTime(ms).toString())
 * @param {Number} milliseconds
 */
const HumanTime = (milliseconds = 0) => {
  const { MS_PER_SECOND, MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY, MS_PER_WEEK } = Constants;

  const buildText = (key, value) => `${value} ${key.replace(/s$/, '')}${value === 1 ? '' : 's'}`;

  const units = [
    {
      key: 'milliseconds',
      baseMultiplier: 1,
    },
    {
      key: 'seconds',
      baseMultiplier: MS_PER_SECOND,
    },
    {
      key: 'minutes',
      baseMultiplier: MS_PER_MINUTE,
    },
    {
      key: 'hours',
      baseMultiplier: MS_PER_HOUR,
    },
    {
      key: 'days',
      baseMultiplier: MS_PER_DAY,
    },
    {
      key: 'weeks',
      baseMultiplier: MS_PER_WEEK,
    },
  ];

  let remainingMilliseconds = milliseconds;
  const humanTime = {};
  for (let i = units.length - 1; i >= 0; i -= 1) {
    const unit = units[i];
    const value = Math.floor(remainingMilliseconds / unit.baseMultiplier);
    if (remainingMilliseconds > 0) {
      remainingMilliseconds -= value * unit.baseMultiplier;
    }
    humanTime[unit.key] = {
      value,
      text: buildText(unit.key, value),
    };
  }

  const toString = () => {
    const keys = Object.keys(humanTime);
    let str = '';
    for (let i = 0; i < keys.length; i += 1) {
      const unit = humanTime[keys[i]];
      if (unit.value > 0) {
        str += `${unit.text}, `;
      }
    }
    return str.replace(/,\s$/, ''); // remove last comma/space
  };

  return Object.assign({}, humanTime, { toString });
};

module.exports = HumanTime;
