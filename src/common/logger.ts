/**
 * logger配置
 * @author minglu_ge<geminglu199698@outlook.com>
 */
import { createLogger, format, transports, Logger } from 'winston';

const { combine, timestamp, printf, prettyPrint, align } = format;

const myFormat = printf(
  ({ level, message, timestamp, stack, context }) =>
    `[${level}] [${timestamp}] [${context}] ${message} ${stack || ''}`,
);

const winstonLogger: Logger = createLogger();

if (process.env.NODE_ENV === 'production') {
  winstonLogger.add(
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
      format: combine(
        timestamp({
          format: () => new Date().toLocaleString('zh-GB'),
        }),
        align(),
        prettyPrint({ colorize: true, depth: 20 }),
        myFormat,
      ),
    }),
  );

  winstonLogger.add(
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp({
          format: () => new Date().toLocaleString('zh-GB'),
        }),
        align(),
        prettyPrint({ colorize: true, depth: 20 }),
        myFormat,
      ),
    }),
  );
}
if (process.env.NODE_ENV === 'development') {
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
}

export default winstonLogger;
