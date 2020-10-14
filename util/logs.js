const path = require('path');

const getLogsPath = () => {
  const LogsPathFromEnvOrDefault =
    process.env.LOGS_OUTPUT_PATH || 'output/logs';

  if (LogsPathFromEnvOrDefault.startsWith('/')) {
    // we were provided an absolute path
    return LogsPathFromEnvOrDefault;
  }
  // this is because __dirname evaluates to '<project_dir>/util'
  // so we go a directory higher and then concat the logs path
  return path.resolve(__dirname, '..', LogsPathFromEnvOrDefault);
};

module.exports = {
  getLogsPath
};
