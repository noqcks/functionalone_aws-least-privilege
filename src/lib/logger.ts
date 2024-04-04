import * as winston from 'winston';

const transports: winston.transport[] = [];
const consoleTransport = new (winston.transports.Console)({

  level: 'error',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  // Removed as 'colorize' is not a valid property in ConsoleTransportOptions

});
transports.push(consoleTransport);

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  transports.push(
    new winston.transports.File({
      name: 'file-log',
      filename: 'xray-scan.log',
      level: 'debug',
      timestamp: true,
      json: false,
      prettyPrint: true,
      maxsize: 1024 * 1024 * 100,
      maxFiles: 10,
      tailable: true,
    }));
}

winston.configure({
  level: 'error',
  transports,
});

export const logger = winston;

export function changeConsoleLevel(level: string) {
  consoleTransport.level = level;
}
