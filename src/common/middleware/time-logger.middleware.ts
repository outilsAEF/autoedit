import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TimeLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    let paramKey, paramLog = '';
    if (req.baseUrl === '/admin-books' || req.baseUrl === '/book') {
      paramKey = 'asin';
      paramLog = 'asin'
    } else if (req.baseUrl === '/api/categories') {
      paramKey = 'id'
      paramLog = 'category';
    }

    const paramValue = req.query[paramKey];
    console.time(`[${paramLog}=${paramValue}] Total request-response time`);
    res.on('finish', () => console.timeEnd(`[${paramLog}=${paramValue}] Total request-response time`))
    next();
  }
}
