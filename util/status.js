const getAppStatus = () => {
  const result = {
    status: 'ok',
    bridgeFound: !!process.env.HUE_BRIDGE_ADDRESS,
    bridgeUserFound: !!process.env.HUE_BRIDGE_USERNAME,
    apiTokenFound: !!process.env.HUE_REMOTE_TOKEN
  };

  return result;
};

module.exports = getAppStatus;
