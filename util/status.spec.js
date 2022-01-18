// There seems to be some contention around this issue
// https://github.com/import-js/eslint-plugin-import/issues/2331
// eslint-disable-next-line import/no-unresolved
const test = require('ava');

const getAppStatus = require('./status');

test('getAppStatus returns status okay when everything is found', t => {
  const mockEnv = {
    HUE_BRIDGE_ADDRESS: '0.0.0.0',
    HUE_BRIDGE_USERNAME: 'a username',
    HUE_REMOTE_TOKEN: 'a token'
  };

  const result = getAppStatus(mockEnv);

  t.is(result.status, 'ok');
});

test('getAppStatus returns status partial_success when some stuff is found', t => {
  const mockEnv = {
    HUE_BRIDGE_ADDRESS: '0.0.0.0',
    HUE_REMOTE_TOKEN: 'a token'
  };

  const result = getAppStatus(mockEnv);

  t.is(result.status, 'partial_success');
});

test('getAppStatus returns status error when nothing is found', t => {
  const result = getAppStatus({});

  t.is(result.status, 'error');
});

test('getAppStatus returns status error when no env is passed in', t => {
  const result = getAppStatus();

  t.is(result.status, 'error');
});

test('getAppStatus returns status error when an invalid value is passed in', t => {
  const result = getAppStatus([]);

  t.is(result.status, 'error');
});
