import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlsModule } from '../../als/als.module';

import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { TestEntity } from './entities/test.entity';

const entities = [TestEntity];

@Module({
  providers: [DevService],
  controllers: [DevController],
  imports: [TypeOrmModule.forFeature(entities), AlsModule]
})
export class DevModule {}
