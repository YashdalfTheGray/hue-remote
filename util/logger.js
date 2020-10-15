const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { getLogsPath } = require('./logs');

const logger = winston.createLogger({
  defaultMeta: { application: 'hue-remote' },
  transports: [
    new DailyRotateFile({
      frequency: '6h',
      zippedArchive: true,
      dirname: getLogsPath(),
      filename: 'application.log',
      maxSize: '10m',
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
    new DailyRotateFile({
      frequency: '6h',
      zippedArchive: true,
      dirname: getLogsPath(),
      filename: 'uncaught-exceptions.log',
      maxSize: '10m',
      format: winston.format.json(),
      level: 'verbose'
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
