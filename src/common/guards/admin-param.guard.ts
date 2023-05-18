import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AdminParamGuard implements CanActivate {

  constructor(private readonly reflector: Reflector, private readonly configService: ConfigService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('going through admin param guard');
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getClass());
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const adminParam = req.query[this.configService.get<string>('ADMIN_PARAM_KEY') as string];

    if (!adminParam) return false;

    return (adminParam === this.configService.get<string>('ADMIN_PARAM_VALUE'));
  }
}
