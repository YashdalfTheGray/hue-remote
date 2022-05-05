import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { getLogsPath } from './logs.js';

// eslint-disable-next-line import/prefer-default-export
export const logger = winston.createLogger({
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
