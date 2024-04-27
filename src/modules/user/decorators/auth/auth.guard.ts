import {
  Get,
  Post,
  UseGuards,
  Injectable,
  CanActivate,
  applyDecorators,
  ExecutionContext
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

import { parseBearerToken, validateToken } from './utils';

@Injectable()
export class CheckToken implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

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
