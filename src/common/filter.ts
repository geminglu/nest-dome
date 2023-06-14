import { ExceptionFilter, ArgumentsHost, HttpException, Catch, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const logger = new Logger('HttpFilter');

    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.warn(`${request.method} ${status} ${request.originalUrl} ${JSON.stringify(exception.getResponse())}`);
    } else {
      logger.error(exception);
    }

    response.status(status).json({
      success: false,
      message: exceptionResponse?.message || exception.message,
      statusCode: status,
    });
  }
}

@Catch()
export class ExcepFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse;
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const logger = new Logger('ExcepFilter');

    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.warn(`${request.method} ${status} ${request.originalUrl} ${JSON.stringify(exception)}`);
    } else {
      logger.error(exception);
    }

    response.status(status).json({
      success: false,
      message:
        exceptionResponse?.message || (exception.getResponse && exception.getResponse()?.message) || exception.message,
      statusCode: status,
    });
  }
}
