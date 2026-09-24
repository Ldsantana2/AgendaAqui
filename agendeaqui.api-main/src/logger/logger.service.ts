import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [new transports.Console()]
        })
    }

    log(message: string, meta?: any) {
        this.logger.info(message, meta); // nível INFO
    }

    warn(message: string, meta?: any) {
        this.logger.warn(message, meta); // nível WARN
    }

    error(message: string, meta?: any) {
        this.logger.error(message, meta); // nível ERROR
    }
}
