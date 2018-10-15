(() => {
  [
    'HUE_BRIDGE_ADDRESS',
    'HUE_BRIDGE_USERNAME',
    'HUE_REMOTE_TOKEN',
    'REDIS_URL'
  ].forEach(key => {
    if (!process.env[key]) {
      throw new Error(
        'hue-remote did not find the right environment variables set.'
      );
    }
  });
})();
