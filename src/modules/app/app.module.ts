import { AsyncLocalStorage } from 'node:async_hooks';

import { MiddlewareConsumer, Module } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UploadModule } from '../upload/upload.module';
import { SessionModule } from '../session/session.module';
import { tokenExtractor } from '../user/utils/tokenExtractor.utils';

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
export class AppModule {
  constructor(
    // inject the AsyncLocalStorage in the module constructor,
    private readonly als: AsyncLocalStorage<any>
  ) {}

  configure(consumer: MiddlewareConsumer) {
    tokenExtractor(this.als, consumer);
  }
}
