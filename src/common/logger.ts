/**
 * logger配置
 * @author minglu_ge<geminglu199698@outlook.com>
 */
import { createLogger, format, transports, Logger } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(
  ({ level, message, timestamp, stack, context }) =>
    `[${level}] [${timestamp as string}] [${context as string}] ${message as string} ${
      (stack as string) || ''
    }`,
);

const winstonLogger: Logger = createLogger();

winstonLogger.add(
  new transports.Console({
    level: 'silly',
    format: combine(
      format.colorize(),
      timestamp({
        format: () => new Date().toLocaleString('zh-GB'),
      }),
      myFormat,
    ),
  }),
);

export default winstonLogger;
