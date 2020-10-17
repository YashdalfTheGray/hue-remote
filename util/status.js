const isObject = require('lodash/isObject');

const getAppStatus = env => {
  if (!env || !isObject(env)) {
    return {
      status: 'error',
      bridgeFound: false,
      bridgeUserFound: false,
      apiTokenFound: false
    };
  }

  const result = {
    bridgeFound: !!env.HUE_BRIDGE_ADDRESS,
    bridgeUserFound: !!env.HUE_BRIDGE_USERNAME,
    apiTokenFound: !!env.HUE_REMOTE_TOKEN
  };

  if (Object.values(result).every(v => v)) {
    result.status = 'ok';
  } else if (Object.values(result).some(v => v)) {
    result.status = 'partial_success';
  } else if (Object.values(result).every(v => !v)) {
    result.status = 'error';
  }

  return result;
};

module.exports = getAppStatus;
