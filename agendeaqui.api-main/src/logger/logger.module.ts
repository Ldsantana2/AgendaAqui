import { Global, Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService, LoggingInterceptor],
  exports: [LoggerService, LoggingInterceptor],
})
export class LoggerModule {}
