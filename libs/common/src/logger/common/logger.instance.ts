import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

import { customFormat } from './logger.format';

const servicename = process.argv[1].split('\\').at(-3);

function getLoggerOption(nodeEnv: string) {
  if (nodeEnv.trim() == 'development') {
    const devLoggerOptions = {
      format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
      transports: [
        new transports.Console({
          level: 'silly',
        }),
      ],
    };
    return devLoggerOptions;
  }
  const prodLoggerOptions = {
    format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
    transports: [
      new transports.Console({
        level: 'silly',
      }),
      new transports.DailyRotateFile({
        filename: `logs/%DATE%-${servicename}.error.log`,
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '30d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/%DATE%-${servicename}.combine.log`,
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '30d',
      }),
    ],
  };
  return prodLoggerOptions;
}

const loggerOptions = getLoggerOption(process.env.NODE_ENV);

export const instance = createLogger(loggerOptions);
