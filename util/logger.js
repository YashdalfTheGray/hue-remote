const winston = require('winston');

const { getLogsPath } = require('./logs');

const logger = winston.createLogger({
  defaultMeta: { application: 'hue-remote' },
  transports: [
    new winston.transports.File({
      filename: `${getLogsPath()}/application.log`,
      format: winston.format.json(),
      level: 'verbose'
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: 'silly'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: `${getLogsPath()}/uncaught-exceptions.log`,
      format: winston.format.json()
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;
