import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

@Injectable()
export class TimeLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: NextFunction) {
    let paramKey, paramLog = '';
    if (['/', '/admin', '/admin-keywords'].includes(req.baseUrl)) return next(); // no logbaseUrl )
    if (req.baseUrl === '/admin-books' || req.baseUrl === '/book') {
      paramKey = 'asin';
      paramLog = 'asin'
    } else if (req.baseUrl === '/api/categories') {
      paramKey = 'id'
      paramLog = 'category';
    } else if (req.baseUrl === '/api/keywords') {
      paramKey = 'keyword';
      paramLog = 'keyword';
    } else if (req.baseUrl === '/api/search-volume') {
      paramKey = 'keyword';
      paramLog = 'keyword';
    } else {
      console.log(`no logs: req.baseUrl=${req.baseUrl}`);
      return next();
    }

    const paramValue = req.query[paramKey];
    console.time(`[${paramLog}=${paramValue}] Total request-response time`);
    res.on('finish', () => console.timeEnd(`[${paramLog}=${paramValue}] Total request-response time`))
    next();
  }
}
