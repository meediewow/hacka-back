import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';

import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';

@Module({
  providers: [TariffsService],
  exports: [TariffsService],
  controllers: [TariffsController],
  imports: [AlsModule, UserModule]
})
export class TariffsModule {}
