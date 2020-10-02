const Promise = require('bluebird');

/**
 *
 * @typedef {(...args: any[]) => Promise<any>} RunFunction
 */

/**
 *
 * @param {Array<RunFunction>} funcs an array of functions to run serially
 * @param {number} delayMs a delay in milliseconds between each function run, defaults to 0
 */
module.exports = (funcs, delayMs = 0) =>
  funcs.reduce(
    (promise, f) =>
      promise.then(results =>
        Promise.delay(delayMs)
          .then(f)
          .then(r => results.concat(r))
      ),
    Promise.resolve([])
  );
