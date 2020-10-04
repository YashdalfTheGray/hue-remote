const test = require('ava');
const Promise = require('bluebird');

const runSerially = require('./runSerially');

test('single promise works', async t => {
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

test('delay also works', async t => {
  const responses = await runSerially([
    () => Promise.delay(50).then(() => 1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
    () => Promise.resolve(4),
    () => Promise.resolve(5),
    () => Promise.resolve(6)
  ]);

  t.deepEqual(responses, [1, 2, 3, 4, 5, 6]);
});

test('order gets maintained', async t => {
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

test('handles async functions properly', async t => {
  const responses = await runSerially([
    async () => 1,
    async () => 2,
    async () => 3,
    async () => 4
  ]);

  t.deepEqual(responses, [1, 2, 3, 4]);
});

test('handles async functions that return promises', async t => {
  const responses = await runSerially([
    async () => Promise.resolve(1),
    async () => Promise.resolve(2),
    async () => Promise.resolve(3),
    async () => Promise.resolve(4)
  ]);

  t.deepEqual(responses, [1, 2, 3, 4]);
});
