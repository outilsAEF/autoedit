import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {


    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();


    if (exception.getStatus() === HttpStatus.NOT_FOUND) return res.status(HttpStatus.NOT_FOUND).json({ statusCode: HttpStatus.NOT_FOUND });

    const req = ctx.getRequest<Request>();

    if (exception.getStatus() === HttpStatus.NOT_FOUND) return res.status(HttpStatus.NOT_FOUND).json({ statusCode: HttpStatus.NOT_FOUND });

    console.error(exception);

    let message = `Erreur interne pendant la requête. Veuillez vérifier les logs`;
    let title = `Erreur interne`;

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object') {
      console.log({ exceptionResponse });
      message = `Erreur lors de la validation: ${(exceptionResponse as any).message.join(', ')}`;
      title = 'Erreur de validation';

    }

    const templateName = (req.path.includes('admin')) ? 'admin' : 'index';


    res.render(templateName, {
      title,
      error: {
        message,
      }
    })
  }
}
