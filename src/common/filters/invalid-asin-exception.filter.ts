import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { InvalidASINException } from 'src/books/books.exceptions';

@Catch(InvalidASINException)
export class InvalidAsinExceptionFilter<T extends InvalidASINException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const asin = exception.asin;

    console.error(exception);
    res.render('index', {
      title: `Erreur pour l'ASIN ${asin}`,
      error: {
        message: `L'ASIN ${asin} n'existe pas. Veuillez vérifier l'ASIN et essayez à nouveau.`
      },
    });
  }
}
