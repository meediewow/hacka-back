import { AsyncLocalStorage } from 'node:async_hooks';

import {
  applyDecorators,
  CanActivate,
  Get,
  Inject,
  Injectable,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class CheckToken implements CanActivate {
  @Inject(AsyncLocalStorage)
  private als: AsyncLocalStorage<any>;

  canActivate(): Promise<boolean> | boolean {
    const store = this.als.getStore();
    return !!store?.user;
  }
}

export const AuthGuard = () =>
  applyDecorators(ApiBearerAuth('jwt-bearer'), UseGuards(CheckToken));

export const GuardGet = (path?: string | string[]) =>
  applyDecorators(AuthGuard(), Get(path));

export const GuardPost = (path?: string | string[]) =>
  applyDecorators(AuthGuard(), Post(path));
