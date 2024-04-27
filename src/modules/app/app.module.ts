import { Module } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule, DevModule, UserModule, SessionModule, UploadModule],
  providers: [],
  controllers: []
})
export class AppModule {}
