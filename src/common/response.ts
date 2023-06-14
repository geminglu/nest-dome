import { NestInterceptor, CallHandler, Injectable, ExecutionContext } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import logger from 'src/common/logger';

interface Data<T> {
  data: T;
}

/**
 * 响应拦截器
 */
@Injectable()
export class ResInterception<T> implements NestInterceptor {
  intercept(context: ExecutionContext, nest: CallHandler): Observable<Data<T>> {
    return nest.handle().pipe(map((data) => data));
  }
}
