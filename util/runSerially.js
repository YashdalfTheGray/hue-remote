const Promise = require('bluebird');

module.exports = (funcs, delay = 0) =>
  funcs.reduce(
    (promise, f) =>
      promise.then(results =>
        Promise.delay(delay)
          .then(f)
          .then(r => results.concat(r))
      ),
    Promise.resolve([])
  );
