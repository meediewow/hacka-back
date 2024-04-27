import { AsyncLocalStorage } from 'node:async_hooks';

import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Get,
  Inject,
  Injectable,
  Post,
  Scope,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

import { parseBearerToken, validateToken } from './utils';

@Injectable({ scope: Scope.DEFAULT })
export class CheckToken implements CanActivate {
  @Inject(AsyncLocalStorage)
  private als: AsyncLocalStorage<any>;

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    console.log(this.als.getStore());

    const authHeader: string = request.header('authorization');

    if (!authHeader) {
      return false;
    }

    try {
      const jwtString = parseBearerToken(authHeader);
      validateToken(jwtString);
    } catch (error) {
      return false;
    }
  }
}

export const AuthGuard = () =>
  applyDecorators(ApiBearerAuth('jwt-bearer'), UseGuards(new CheckToken()));

export const GuardGet = (path?: string | string[]) =>
  applyDecorators(AuthGuard(), Get(path));

export const GuardPost = (path?: string | string[]) =>
  applyDecorators(AuthGuard(), Post(path));
