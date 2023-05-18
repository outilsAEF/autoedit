import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TimeLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const asin = req.query['asin'];
    console.time(`[asin=${asin}] Total request-response time`);
    res.on('finish', () => console.timeEnd(`[asin=${asin}] Total request-response time`));
    next();
  }
}
