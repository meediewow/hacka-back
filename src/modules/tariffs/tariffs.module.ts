import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UserService } from '../user/user.service';

import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';

@Module({
  providers: [TariffsService, UserService],
  exports: [TariffsService],
  controllers: [TariffsController],
  imports: [AlsModule, UserModule]
})
export class TariffsModule {}
