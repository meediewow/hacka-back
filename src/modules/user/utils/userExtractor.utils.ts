import { AsyncLocalStorage } from 'node:async_hooks';

import { Request } from 'express';
import { MiddlewareConsumer } from '@nestjs/common';

import { UserService } from '../user.service';
import { parseBearerToken, validateToken } from '../decorators/auth/utils';

export const userExtractor = (
  als: AsyncLocalStorage<any>,
  userService: UserService,
  consumer: MiddlewareConsumer
) => {
  consumer
    .apply(async (req: Request, _, next) => {
      const authHeader: string = req.header('authorization');

      if (!authHeader) {
        return next();
      }

      try {
        const jwtString = parseBearerToken(authHeader);
        const payload = validateToken(jwtString);

        const user = await userService.findUser({ id: payload.id });

        if (!user) {
          next();
        }

        als.run({ user }, () => next());
      } catch (error) {
        next();
      }
    })
    .forRoutes('*');
};
