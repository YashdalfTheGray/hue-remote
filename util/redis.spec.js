// There seems to be some contention around this issue
// https://github.com/import-js/eslint-plugin-import/issues/2331
// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import { injectRedis } from './redis';

test('injectRedis works', t => {
  const next = () => {
    t.pass(true);
  };
  const mockRes = { locals: {} };
  const middleware = injectRedis('test-redis');

  middleware(null, mockRes, next);
  t.is(mockRes.locals.redis, 'test-redis');
});
