// src/middleware/trace-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = uuidv4();
    // Anexa no request e response para toda a stack
    req['traceId'] = traceId;
    res.setHeader('x-trace-id', traceId);
    next();
  }
}
