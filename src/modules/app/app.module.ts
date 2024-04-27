import { AsyncLocalStorage } from 'node:async_hooks';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UserService } from '../user/user.service';
import { UploadModule } from '../upload/upload.module';
import { SessionModule } from '../session/session.module';
import { userExtractor } from '../user/utils/userExtractor.utils';

@Module({
  imports: [
    AlsModule,
    DevModule,
    UserModule,
    UploadModule,
    SessionModule,
    TypeOrmModule
  ],
  providers: [],
  controllers: []
})
export class AppModule implements NestModule {
  constructor(
    private readonly als: AsyncLocalStorage<any>,
    private readonly userService: UserService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    userExtractor(this.als, this.userService, consumer);
  }
}
