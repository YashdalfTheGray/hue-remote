/* eslint-disable max-classes-per-file */

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

class Singleton {
  getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Logger();
    }
  }
}

module.exports = Singleton;
