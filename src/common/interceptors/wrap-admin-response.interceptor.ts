import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class WrapAdminResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('WrapAdminResponseInterceptor - before');

    const adminParamKey = this.configService.get<string>('ADMIN_PARAM_KEY');
    const adminParamValue = this.configService.get<string>('ADMIN_PARAM_VALUE');
    console.log(`WRI - ${adminParamKey} - ${adminParamValue} `)


    return next.handle().pipe(
      tap(() => { console.log('WrapAdminResponseInterceptor - after') }),
      map(data => {
        console.log('WRI', data);
        return { ...data, adminParam: `&${adminParamKey}=${adminParamValue}` }
      }));
  }
}
