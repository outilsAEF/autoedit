import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();


    if (exception.getStatus() === HttpStatus.NOT_FOUND) return res.status(HttpStatus.NOT_FOUND).json({ statusCode: HttpStatus.NOT_FOUND });

    console.error(exception);
    res.render('index', {
      title: `Erreur interne`,
      error: {
        message: `Erreur interne pendant la requête. Veuillez vérifier les logs`
      }
    })
  }
}
