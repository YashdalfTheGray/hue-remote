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

const promisifyMethods = (target, methodList, suffix = 'Async') => {
  if (!target || typeof target !== 'function' || typeof target !== 'object') {
    throw new TypeError('Invalid target for promisification');
  }
  if (typeof suffix !== 'string') {
    throw new TypeError('Invalid suffix, must be a string');
  }
  if (methodList.length === 0) {
    return target;
  }

  return target;
};

module.exports = {
  delayAsync,
  runSerially,
  promisifyMethods
};
