import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Get,
  Inject,
  Injectable,
  Post,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../types/user.types';
import { UserEntity } from '../../entities';
import { AlsService } from '../../../../als/als.service';

@Injectable()
export class CheckToken implements CanActivate {
  @Inject(AlsService)
  private als!: AlsService;

  @Inject(Reflector)
  private reflector!: Reflector;

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const roles = this.reflector.get<UserRole[]>(
      ROLE_METADATA_KEY,
      context.getHandler()
    );

    try {
      const store = this.als.getStore();

      if (!store?.user) {
        return false;
      }

      const rolesCheck = roles.map((role) => this.hasRole(role, store?.user));
      return rolesCheck.includes(true);
    } catch (e) {
      return false;
    }
  }

  private hasRole(role: UserRole, user: UserEntity): boolean {
    return user.roles.includes(role);
  }
}

export const ROLE_METADATA_KEY = 'role';

export const AuthGuard = (roles: UserRole[]) =>
  applyDecorators(
    SetMetadata(ROLE_METADATA_KEY, roles),
    ApiBearerAuth('jwt-bearer'),
    UseGuards(CheckToken)
  );

export const GuardGet = (roles: UserRole[], path?: string | string[]) =>
  applyDecorators(AuthGuard(roles), Get(path));

export const GuardPost = (roles: UserRole[], path?: string | string[]) =>
  applyDecorators(AuthGuard(roles), Post(path));
