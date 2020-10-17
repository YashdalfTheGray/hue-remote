const test = require('ava');

const { runSerially, delayAsync } = require('./promises');

test('delayAsync delays and then returns value', async t => {
  const delay = 200;
  const start = Date.now();
  const result = await delayAsync(delay, 'foo');
  const end = Date.now();

  console.log(start, end);

  t.is(result, 'foo');
  t.assert(end > start + delay);
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
