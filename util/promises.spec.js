/* eslint-disable max-classes-per-file */

// There seems to be some contention around this issue
// https://github.com/import-js/eslint-plugin-import/issues/2331
// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { runSerially, delayAsync, promisifyMethods } from './promises';

test('delayAsync delays and then returns value', async t => {
  const delay = 200;
  const start = Date.now();
  const result = await delayAsync(delay, 'foo');
  const end = Date.now();

  t.is(result, 'foo');
  t.assert(end >= start + delay);
  t.assert(end < start + delay * 1.25);
});

test('runSerially accepts a single promise', async t => {
  const responses = await runSerially([() => Promise.resolve(true)]);

  t.deepEqual(responses, [true]);
});

test('many promises work', async t => {
  const responses = await runSerially([
    () => Promise.resolve(true),
    () => Promise.resolve(false),
    () => Promise.resolve(true),
    () => Promise.resolve(false),
    () => Promise.resolve(true),
    () => Promise.resolve(false)
  ]);

  t.deepEqual(responses, [true, false, true, false, true, false]);
});

test('runSerially works with a delay', async t => {
  const responses = await runSerially([
    () => delayAsync(50).then(() => 1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
    () => Promise.resolve(4),
    () => Promise.resolve(5),
    () => Promise.resolve(6)
  ]);

  t.deepEqual(responses, [1, 2, 3, 4, 5, 6]);
});

test('runSerially maintains order of functions', async t => {
  const responses = await runSerially(
    [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
      () => Promise.resolve(4)
    ],
    10
  );

  t.deepEqual(responses, [1, 2, 3, 4]);
});

test('runSerially handles async functions properly', async t => {
  const responses = await runSerially([
    async () => 1,
    async () => 2,
    async () => 3,
    async () => 4
  ]);

  t.deepEqual(responses, [1, 2, 3, 4]);
});

test('runSerially handles async functions that return promises', async t => {
  const responses = await runSerially([
    async () => Promise.resolve(1),
    async () => Promise.resolve(2),
    async () => Promise.resolve(3),
    async () => Promise.resolve(4)
  ]);

  t.deepEqual(responses, [1, 2, 3, 4]);
});

test('promisifyMethods creates async version of methods passed in', async t => {
  const target = {
    test: (a, b, cb) => cb(null, a + b)
  };

  const promisified = promisifyMethods(target, ['test']);
  const result = await promisified.testAsync(4, 5);

  t.is(result, 9);
});

test('promisifyMethods creates methods that handle rejections properly', async t => {
  const target = {
    test: (a, b, cb) => cb(new Error('Something went wrong'))
  };

  const promisified = promisifyMethods(target, ['test']);
  await t.throwsAsync(() => promisified.testAsync(4, 5));
});

test('promisifyMethods checks for target to be an object', async t => {
  const target = 'test';

  t.throws(() => promisifyMethods(target, ['foo']));
});

test('promisifyMethods checks for suffix to be string', t => {
  const target = {
    test: (a, b, cb) => cb(null, a + b)
  };

  t.throws(() => promisifyMethods(target, ['test'], null));
});

test('promisifyMethods returns everything unchanged if no methods are selected', t => {
  const target = {
    test: (a, b, cb) => cb(null, a + b)
  };

  const result = promisifyMethods(target);

  t.deepEqual(result, target);
});

test('promisifyMethods returns everything unchanged if empty list of methods', t => {
  const target = {
    test: (a, b, cb) => cb(null, a + b)
  };

  const result = promisifyMethods(target, []);

  t.deepEqual(result, target);
});

test(`promisifyMethods throws if method doesn't exist on target`, t => {
  const target = {
    test: (a, b, cb) => cb(null, a + b)
  };

  t.throws(() => promisifyMethods(target, ['foo']));
});

test('promisifyMethods works for an ES6 class', async t => {
  class Test {
    constructor(name) {
      this.name = name;
    }

    say(sentence, cb) {
      cb(null, `Hey, ${this.name}! ${sentence}`);
    }
  }

  promisifyMethods(Test, ['say']);

  const instance = new Test('foo');
  const result = await instance.sayAsync('Hello!');
  t.is(result, 'Hey, foo! Hello!');
});

test('promisifyMethods works for an ES6 class instance', async t => {
  class Test {
    constructor(name) {
      this.name = name;
    }

    say(sentence, cb) {
      cb(null, `Hey, ${this.name}! ${sentence}`);
    }
  }

  const instance = new Test('foo');
  promisifyMethods(instance, ['say']);

  const result = await instance.sayAsync('Hello!');
  t.is(result, 'Hey, foo! Hello!');
});

test('promisifyMethods works for a constructor function', async t => {
  function Test(name) {
    this.name = name;
  }

  Test.prototype.say = function say(sentence, cb) {
    cb(null, `Hey, ${this.name}! ${sentence}`);
  };

  promisifyMethods(Test, ['say']);
  const instance = new Test('foo');

  const result = await instance.sayAsync('Hello!');
  t.is(result, 'Hey, foo! Hello!');
});

test('promisifyMethods works for a constructor function instance', async t => {
  function Test(name) {
    this.name = name;
  }

  Test.prototype.say = function say(sentence, cb) {
    cb(null, `Hey, ${this.name}! ${sentence}`);
  };

  const instance = new Test('foo');
  promisifyMethods(instance, ['say']);

  const result = await instance.sayAsync('Hello!');
  t.is(result, 'Hey, foo! Hello!');
});
