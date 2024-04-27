import { AsyncLocalStorage } from 'node:async_hooks';

import { Request } from 'express';
import { MiddlewareConsumer } from '@nestjs/common';

import { parseBearerToken, validateToken } from '../decorators/auth/utils';

export const tokenExtractor = (
  als: AsyncLocalStorage<any>,
  consumer: MiddlewareConsumer
) => {
  consumer
    .apply((req: Request, _, next) => {
      const authHeader: string = req.header('authorization');

      if (!authHeader) {
        return next();
      }

      try {
        const jwtString = parseBearerToken(authHeader);
        const payload = validateToken(jwtString);

        als.run({ userId: payload.id }, () => next());
      } catch (error) {
        next();
      }
    })
    .forRoutes('*');
};
