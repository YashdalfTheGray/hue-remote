const path = require('path');

const winston = require('winston');

const { getLogsPath } = require('./logs');

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { application: 'hue-remote' },
      transports: [
        new winston.transports.File({
          filename: path.resolve(getLogsPath(), 'application.log')
        })
      ]
    });
  }
}

module.exports = Logger;
