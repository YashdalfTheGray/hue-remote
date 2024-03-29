import { promisify } from 'util';

export const delayAsync = (delayInMs, resolveValue) =>
  new Promise(resolve =>
    // eslint-disable-next-line no-promise-executor-return
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
export const runSerially = (funcs, delayMs = 0) =>
  funcs.reduce(
    (promise, f) =>
      promise.then(results =>
        delayAsync(delayMs)
          .then(f)
          .then(r => results.concat(r))
      ),
    Promise.resolve([])
  );

/**
 * promisifyMethods takes an object with methods and a list of methods contained
 * in that object, and converts them from the classic node-style callback to
 * returning promises. This modifies the target and also returns it.
 * @param {Object} target the object to draw methods from
 * @param {String[]} methodList a list of methods to promisify
 * @param {string} suffix a suffix to add to the promisified methods, defaults to 'Async'
 * @returns the target, but with additional methods added to it
 */
export const promisifyMethods = (target, methodList, suffix = 'Async') => {
  if (!target || (typeof target !== 'function' && typeof target !== 'object')) {
    throw new TypeError('Invalid target for promisification');
  }
  if (typeof suffix !== 'string') {
    throw new TypeError('Invalid suffix, must be a string');
  }
  if (!methodList || methodList.length === 0) {
    return target;
  }

  methodList.forEach(m => {
    if (target[m]) {
      /* eslint-disable-next-line no-param-reassign */
      target[`${m}Async`] = promisify(target[m]).bind(target);
    } else if (target.prototype && target.prototype[m]) {
      /* eslint-disable-next-line no-param-reassign */
      target.prototype[`${m}Async`] = promisify(target.prototype[m]);
    } else {
      throw new Error(`No method exists by name ${m}`);
    }
  });

  return target;
};
