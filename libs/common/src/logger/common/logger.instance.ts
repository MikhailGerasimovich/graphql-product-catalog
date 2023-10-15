import { createLogger, format, transports } from 'winston';

import { customFormat } from './logger.format';

const devLoggerOptions = {
  format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
  transports: [
    new transports.Console({
      level: 'silly',
    }),
  ],
};

const servicename = process.argv[1].split('\\').at(-3);

const prodLoggerOptions = {
  format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
  transports: [
    new transports.Console({
      level: 'silly',
    }),
    new transports.File({
      filename: `${servicename}.error.log`,
      level: 'error',
    }),
    new transports.File({
      filename: `${servicename}.combine.log`,
      level: 'info',
    }),
  ],
};

function getLoggerOption(nodeEnv: string) {
  if (nodeEnv.trim() == 'development') return devLoggerOptions;
  return prodLoggerOptions;
}

const loggerOptions = getLoggerOption(process.env.NODE_ENV);

export const instance = createLogger(loggerOptions);
