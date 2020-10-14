const path = require('path');

const getLogsPath = () => {
  const LogsPathFromEnvOrDefault =
    process.env.LOGS_OUTPUT_PATH || 'output/logs';

  if (LogsPathFromEnvOrDefault.startsWith('/')) {
    // we were provided an absolute path
    return LogsPathFromEnvOrDefault;
  }
  return path.resolve(__dirname, LogsPathFromEnvOrDefault);
};

module.exports = {
  getLogsPath
};
