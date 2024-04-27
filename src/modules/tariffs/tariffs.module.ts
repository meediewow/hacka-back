import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';

@Module({
  providers: [TariffsService],
  exports: [TariffsService],
  controllers: [TariffsController],
  imports: [UserModule]
})
export class TariffsModule {}
