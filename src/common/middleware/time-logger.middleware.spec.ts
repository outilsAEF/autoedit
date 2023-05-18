import { TimeLoggerMiddleware } from './time-logger.middleware';

describe('TimeLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new TimeLoggerMiddleware()).toBeDefined();
  });
});
