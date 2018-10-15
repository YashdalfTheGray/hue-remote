const test = require('ava');
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
  t.is(mockRes.statusCode, 401);
});

test('wrong accessToken in POST request body', t => {
  const mockRes = createMockResponse();

  process.env.HUE_REMOTE_TOKEN = 'actual-token';

  checkAuthToken(
    {
      method: 'POST',
      body: { accessToken: 'bad-token' }
    },
    mockRes
  );
  t.is(mockRes.statusCode, 403);
});

test('good accessToken in POST request body', t => {
  const next = () => {
    t.pass(true);
  };

  process.env.HUE_REMOTE_TOKEN = 'actual-token';

  checkAuthToken(
    {
      method: 'POST',
      body: { accessToken: 'actual-token' },
      get: () => "don't do this"
    },
    null,
    next
  );
});

test('good accessToken in the header of a POST', t => {
  const next = () => {
    t.pass(true);
  };

  process.env.HUE_REMOTE_TOKEN = 'actual-token';

  checkAuthToken(
    {
      method: 'POST',
      get: () => 'Bearer actual-token',
      body: {}
    },
    {},
    next
  );
});

test('malformed auth header', t => {
  const mockRes = createMockResponse();

  checkAuthToken({ get: () => 'stuff stuff' }, mockRes);
  t.is(mockRes.statusCode, 401);
});

test('unauthorized user', t => {
  const mockRes = createMockResponse();

  process.env.HUE_REMOTE_TOKEN = 'actual-token';

  checkAuthToken({ get: () => 'Bearer stuff' }, mockRes);
  t.is(mockRes.statusCode, 403);
});

test('unauthorized user', t => {
  const next = () => {
    t.pass(true);
  };

  process.env.HUE_REMOTE_TOKEN = 'actual-token';

  checkAuthToken({ get: () => 'Bearer actual-token' }, {}, next);
});
