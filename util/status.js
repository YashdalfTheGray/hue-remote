import isObject from 'lodash-es/isObject.js';

/**
 * @typedef { import('./types').HueRemoteStatus } HueRemoteStatus
 */

/**
 * getAppStatus evaluates the current process environment and determines if everything
 * for proper operation is available
 * @param {object} env the environment of the node.js process, commonly `process.env`
 * @returns {HueRemoteStatus} the status of the application
 */
// eslint-disable-next-line import/prefer-default-export
export const getAppStatus = env => {
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
