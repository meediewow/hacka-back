import {
  CanActivate,
  ExecutionContext,
  Get,
  Injectable,
  Post,
  UseGuards,
  applyDecorators
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AppJwtPayload } from './types';
import { parseBearerToken, validateToken } from './utils';

const checkAppJwtPayload = async (payload: AppJwtPayload) => {
  return payload.password === 'test';
};

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
      const payload = validateToken(jwtString);
      return checkAppJwtPayload(payload);
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
