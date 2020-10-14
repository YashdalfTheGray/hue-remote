/* eslint-disable max-classes-per-file */

const path = require('path');

const winston = require('winston');

const { getLogsPath } = require('./logs');

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      defaultMeta: { application: 'hue-remote' },
      transports: [
        new winston.transports.File({
          filename: path.resolve(getLogsPath(), 'application.log'),
          format: winston.format.json()
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.resolve(getLogsPath(), 'uncaught-exceptions.log'),
          format: winston.format.json()
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
    return Singleton.instance;
  }
}

module.exports = Singleton;
