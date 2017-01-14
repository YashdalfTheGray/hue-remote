const test = require('tape');
const checkAuthToken = require('./checkAuthToken');

function createMockResponse() {
    return {
        status: function status(code) {
            this.statusCode = code;
            return this;
        },
        json: function json() {
            return this;
        }
    };
}

test('missing auth header', t => {
    const mockRes = createMockResponse();

    checkAuthToken({ get: () => '' }, mockRes);
    t.equal(mockRes.statusCode, 401);
    t.end();
});

test('malformed auth header', t => {
    const mockRes = createMockResponse();

    checkAuthToken({ get: () => 'stuff stuff' }, mockRes);
    t.equal(mockRes.statusCode, 401);
    t.end();
});

test('unauthorized user', t => {
    const mockRes = createMockResponse();

    process.env.HUE_REMOTE_TOKEN = 'actual-token';

    checkAuthToken({ get: () => 'Bearer stuff' }, mockRes);
    t.equal(mockRes.statusCode, 403);
    t.end();
});

test('unauthorized user', t => {
    const next = () => {
        t.assert(true);
        t.end();
    };

    process.env.HUE_REMOTE_TOKEN = 'actual-token';

    checkAuthToken({ get: () => 'Bearer actual-token' }, {}, next);
});
