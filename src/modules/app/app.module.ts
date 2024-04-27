import { Module } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { AlsModule } from '../../asl/asl.module';
import { UploadModule } from '../upload/upload.module';
import { SessionModule } from '../session/session.module';

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
export class AppModule {}
