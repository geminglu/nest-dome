import { HttpStatus, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  next();

  const logger = new Logger('loggerMiddleware');
  if (res.statusCode < HttpStatus.BAD_REQUEST) {
    logger.log(`${req.method} ${res.statusCode} ${req.originalUrl}`);
  }
}
