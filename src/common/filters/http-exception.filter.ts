import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    console.error(exception);

    res.render('index', {
      title: `Erreur interne`,
      error: {
        message: `Erreur interne pendant la requête. Veuillez vérifier les logs`
      }
    })
  }
}
