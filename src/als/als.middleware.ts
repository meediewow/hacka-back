import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  parseBearerToken,
  validateToken
} from '../modules/user/decorators/auth/utils';
import { UserService } from '../modules/user/services/user.service';

import { AlsService } from './als.service';

@Injectable()
export class AlsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AlsInterceptor.name);
  @Inject(AlsService)
  private readonly alsService: AlsService;

  @Inject(UserService)
  private userService: UserService;

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request?.header('authorization');

    if (!authHeader) {
      return next.handle();
    }

    try {
      const jwtString = parseBearerToken(authHeader);
      const payload = validateToken(jwtString);

      const user = await this.userService.findByIdOrFail(payload.id);

      this.alsService.run({ user }, next.handle);
    } catch (error) {
      this.logger.error(error);
    }
    return next.handle();
  }
}
