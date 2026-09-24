import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  data: T | null;
  isSuccess?: boolean;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((response: T & object) => {
        if (this.isResponseFormat(response)) {
          return {
            data: response.data ?? null,
            isSuccess: response.isSuccess ?? true,
            message: response.message ?? 'Request successful',
          };
        }

        return {
          data: response,
          isSuccess: true,
          message: 'Request successful',
        };
      }),
    );
  }

  private isResponseFormat(obj: any): obj is ResponseFormat<any> {
    return (
      obj &&
      (typeof obj.data !== 'undefined' ||
        typeof obj.isSuccess !== 'undefined' ||
        typeof obj.message !== 'undefined')
    );
  }
}
