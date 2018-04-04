/**
 * @param {Number} period for the moving average
 */
const SimpleMovingAverage = ({ period = 30, values = [] }) => {
  let _values = values;

  /**
   * calculate and return the average
   * @return {Null|Number} simple moving average if enough values else null
   */
  const get = () => {
    if (_values.length < period) {
      return null;
    }
    let sum = 0;
    for (let i = 0; i < period; i += 1) {
      sum += _values[i];
    }
    return sum / period;
  };

  /**
   * updates internal values
   * @param {Number} value to add to internal `values`
   * @return {Array} values
   */
  const update = (value) => {
    // add new value
    _values = [..._values, value];

    if (_values.length > period) {
      // remove oldest value
      const diff = _values.length - period;
      _values = _values.slice(diff);
    }
    return _values;
  };

  return { get, update };
};

module.exports = SimpleMovingAverage;
