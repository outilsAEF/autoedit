import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { InvalidASINException } from 'src/books/books.exceptions';

@Catch(InvalidASINException)
export class InvalidAsinExceptionFilter<T extends InvalidASINException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const asin = exception.asin;


    const templateName = (req.path.includes('admin')) ? 'admin' : 'index';

    res.status(HttpStatus.BAD_REQUEST).render(templateName, {
      title: `Erreur pour l'ASIN ${asin}`,
      error: {
        message: `L'ASIN ${asin} n'existe pas. Veuillez vérifier l'ASIN et essayez à nouveau.`
      },
    });
  }
}
