const test = require('tape');
const HumanTime = require('../common/human-time.js');
const {
  MS_PER_SECOND,
  MS_PER_MINUTE,
  MS_PER_HOUR,
  MS_PER_DAY,
  MS_PER_WEEK,
} = require('../common/constants.js');

const expected = {
  milliseconds: {
    value: 42,
    text: `${42} milliseconds`,
  },
  seconds: {
    value: 21,
    text: `${21} seconds`,
  },
  minutes: {
    value: 1,
    text: `${1} minute`, // singular
  },
  hours: {
    value: 3,
    text: `${3} hours`,
  },
  days: {
    value: 2,
    text: `${2} days`,
  },
  weeks: {
    value: 1,
    text: `${1} week`, // singular
  },
};

test(`HumanTime | values`, (assert) => {
  assert.equal(
    HumanTime(expected.milliseconds.value).milliseconds.value,
    expected.milliseconds.value,
    'milliseconds value'
  );
  assert.equal(
    HumanTime(expected.milliseconds.value).milliseconds.text,
    expected.milliseconds.text,
    'milliseconds text'
  );

  assert.equal(
    HumanTime(expected.seconds.value * 1000).seconds.value,
    expected.seconds.value,
    'seconds value'
  );
  assert.equal(
    HumanTime(expected.seconds.value * 1000).seconds.text,
    expected.seconds.text,
    'seconds text'
  );

  assert.equal(
    HumanTime(expected.minutes.value * 1000 * 60).minutes.value,
    expected.minutes.value,
    'minutes value'
  );
  assert.equal(
    HumanTime(expected.minutes.value * 1000 * 60).minutes.text,
    expected.minutes.text,
    'minutes text'
  );

  assert.equal(
    HumanTime(expected.hours.value * 1000 * 60 * 60).hours.value,
    expected.hours.value,
    'hours value'
  );
  assert.equal(
    HumanTime(expected.hours.value * 1000 * 60 * 60).hours.text,
    expected.hours.text,
    'hours text'
  );

  assert.equal(
    HumanTime(expected.days.value * 1000 * 60 * 60 * 24).days.value,
    expected.days.value,
    'days value'
  );
  assert.equal(
    HumanTime(expected.days.value * 1000 * 60 * 60 * 24).days.text,
    expected.days.text,
    'days text'
  );

  assert.equal(
    HumanTime(expected.weeks.value * 1000 * 60 * 60 * 24 * 7).weeks.value,
    expected.weeks.value,
    'weeks value'
  );
  assert.equal(
    HumanTime(expected.weeks.value * 1000 * 60 * 60 * 24 * 7).weeks.text,
    expected.weeks.text,
    'weeks text'
  );

  assert.end();
});

test(`HumanTime | toString`, (assert) => {
  assert.equal(
    HumanTime(expected.milliseconds.value).toString(),
    '42 milliseconds',
    'toString milliseconds'
  );
  assert.equal(
    HumanTime(expected.seconds.value * MS_PER_SECOND + expected.milliseconds.value).toString(),
    '21 seconds, 42 milliseconds',
    'toString seconds'
  );
  assert.equal(
    HumanTime(
      expected.minutes.value * MS_PER_MINUTE +
        expected.seconds.value * MS_PER_SECOND +
        expected.milliseconds.value
    ).toString(),
    '1 minute, 21 seconds, 42 milliseconds',
    'toString minutes'
  );
  assert.equal(
    HumanTime(
      expected.hours.value * MS_PER_HOUR +
        expected.minutes.value * MS_PER_MINUTE +
        expected.seconds.value * MS_PER_SECOND +
        expected.milliseconds.value
    ).toString(),
    '3 hours, 1 minute, 21 seconds, 42 milliseconds',
    'toString hours'
  );
  assert.equal(
    HumanTime(
      expected.days.value * MS_PER_DAY +
        expected.hours.value * MS_PER_HOUR +
        expected.minutes.value * MS_PER_MINUTE +
        expected.seconds.value * MS_PER_SECOND +
        expected.milliseconds.value
    ).toString(),
    '2 days, 3 hours, 1 minute, 21 seconds, 42 milliseconds',
    'toString days'
  );
  assert.equal(
    HumanTime(
      expected.weeks.value * MS_PER_WEEK +
        expected.days.value * MS_PER_DAY +
        expected.hours.value * MS_PER_HOUR +
        expected.minutes.value * MS_PER_MINUTE +
        expected.seconds.value * MS_PER_SECOND +
        expected.milliseconds.value
    ).toString(),
    '1 week, 2 days, 3 hours, 1 minute, 21 seconds, 42 milliseconds',
    'toString weeks'
  );

  assert.end();
});
