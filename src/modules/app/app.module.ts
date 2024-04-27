import { Module } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { UploadModule } from '../upload/upload.module';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    TypeOrmModule,
    DevModule,
    UserModule,
    SessionModule,
    UploadModule,
    PetModule
  ],
  providers: [],
  controllers: []
})
export class AppModule {}
