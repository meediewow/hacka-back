import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from './entities';
import { SessionService } from './session.service';

const entities = [SessionEntity];

@Module({
  exports: [SessionService],
  providers: [SessionService],
  imports: [TypeOrmModule.forFeature(entities)]
})
export class SessionModule {}
