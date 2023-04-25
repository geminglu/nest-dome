import { ExceptionFilter, ArgumentsHost, HttpException, Catch, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const logger = new Logger('loggerMiddleware');

    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.warn(`${request.method} ${status} ${request.originalUrl} ${JSON.stringify(exception.getResponse())}`);
    } else {
      logger.error(exception);
    }

    let msg: {
      message?: string;
    };
    // eslint-disable-next-line prefer-const
    msg = exception.getResponse() as object;
    response.status(status).json({
      message: msg.message,
      statusCode: status,
    });
  }
}
