import { NextFunction, Request, Response } from "express";

export function secure(req: Request, res: Response, next: NextFunction) {
  const local = req.url;
  // const schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
  const schema = (req.header('x-forwarded-proto') || '').toLowerCase();
  // const www = req.headers.host.replace(/www\./gi, '');
  const www = (req.header('host') || '').replace(/www\./gi, '');
  const fullUrl = 'https://' + www + local;
  const removeSlash = function removeSlash(site) {
    return site.replace(/\/$/, '');
  };

  const notLocalHost = !www.includes('localhost');

  if (notLocalHost) {
    if (schema !== 'https') {
      return res.redirect(removeSlash(fullUrl));
    }
    // if (/^www\./i.test(req.headers.host) && schema === 'https') {
    if (/^www\./i.test((req.header('host') || '')) && schema === 'https') {
      return res.redirect(removeSlash(fullUrl));
    }
    if (/\/$/.test(fullUrl) && fullUrl !== 'https://' + www + '/') {
      return res.redirect(removeSlash(fullUrl));
    }
  }

  return next();

}