import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoggerService } from './logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;

    const handler = context.getClass();
    const controllerName = handler?.name || 'UnknownModule';

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;

        this.logger.log('Request completed', {
          controller: controllerName,
          url: originalUrl,
          statusCode,
          duration: `${Date.now() - now}ms`,
          traceId: request['traceId'], // <<== AQUI
        });
      }),
      catchError((err) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const [errorName, location] = err.stack?.split('\n') ?? [];

        const duration = `${Date.now() - now}ms`;

        if (statusCode >= 400 && statusCode < 500) {
          this.logger.warn('Client error', {
            controller: controllerName,
            method,
            url: originalUrl,
            statusCode,
            duration,
            traceId: request['traceId'],
          });
        } else {
          this.logger.error('Request failed', {
            controller: controllerName,
            method,
            url: originalUrl,
            statusCode,
            duration,
            stack: `${errorName} | ${location?.trim()}`,
            error: err.message,
            traceId: request['traceId'],
          });
        }
        return throwError(() => err);
      }),
    );
  }
}
