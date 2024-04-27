import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';

import {
  parseBearerToken,
  validateToken
} from '../modules/user/decorators/auth/utils';
import { UserService } from '../modules/user/services/user.service';

import { AlsService } from './als.service';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AlsMiddleware.name);

  @Inject(AlsService)
  private readonly alsService: AlsService;

  @Inject(UserService)
  private userService: UserService;

  async use(request: any, res: any, next: () => void) {
    const authHeader = request?.header('authorization');

    if (!authHeader) {
      return next();
    }

    try {
      const jwtString = parseBearerToken(authHeader);
      const payload = validateToken(jwtString);

      const user = await this.userService.findByIdOrFail(payload.id);

      this.alsService.enterWith({ user });
    } catch (error) {
      this.logger.error(error);
    }
    return next();
  }
}
