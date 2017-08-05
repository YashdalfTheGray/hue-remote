const test = require('ava');
const { injectRedis } = require('./redis');

test('injectRedis works', (t) => {
    const next = () => {
        t.pass(true);
    };
    const mockRes = { locals: {} };
    const middleware = injectRedis('test-redis');

    middleware(null, mockRes, next);
    t.is(mockRes.locals.redis, 'test-redis');
});
