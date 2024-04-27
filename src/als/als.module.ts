import {
  forwardRef,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';

import { UserModule } from '../modules/user/user.module';

import { AlsService } from './als.service';
import { AlsMiddleware } from './als.middleware';

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AlsService],
  exports: [AlsService]
})
export class AlsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
