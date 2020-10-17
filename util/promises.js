const delayAsync = (delayInMs, resolveValue) =>
  new Promise(resolve =>
    setTimeout(() => resolve(resolveValue || null), delayInMs)
  );

/**
 * @template T
 * @typedef { (...args: any[]) => Promise<T> } RunFunction
 */

/**
 * @template T
 * @param {Array<RunFunction<T>>} funcs an array of functions to run serially
 * @param {number} delayMs a delay in milliseconds between each function run, defaults to 0
 * @return {Promise<T[]>} an array of results that match the order of functions executed
 */
const runSerially = (funcs, delayMs = 0) =>
  funcs.reduce(
    (promise, f) =>
      promise.then(results =>
        delayAsync(delayMs)
          .then(f)
          .then(r => results.concat(r))
      ),
    Promise.resolve([])
  );

module.exports = {
  delayAsync,
  runSerially
};
