import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UserService } from '../user/user.service';

import { SittersService } from './sitters.service';
import { SittersController } from './sitters.controller';

@Module({
  providers: [SittersService, UserService],
  exports: [SittersService],
  controllers: [SittersController],
  imports: [AlsModule, UserModule]
})
export class SittersModule {}
