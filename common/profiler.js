const Profiler = (namespace = 'Profiler') => {
  const model = {
    startMs: 0,
    stopMs: 0,
    diffMs: 0,
  };

  const inSeconds = () => (model.diffMs / 1000).toFixed(2);
  const inMilliseconds = () => model.diffMs;
  const get = () => model;

  const log = (namespaceOverride = namespace) =>
    console.log(`${namespaceOverride}: diff of ${inMilliseconds()}ms | ${inSeconds()}s`);

  const start = () => {
    model.startMs = new Date().getTime();
    log();
  };

  const stop = () => {
    model.stopMs = new Date().getTime();
    model.diffMs = model.stopMs - model.startMs;
  };

  const isRunning = () => model.startMs !== 0;

  return { start, stop, get, log, inSeconds, inMilliseconds, isRunning };
};

if (typeof window !== 'undefined') {
  window.Profiler = Profiler;
} else if (typeof module !== 'undefined') {
  module.exports = Profiler;
}
