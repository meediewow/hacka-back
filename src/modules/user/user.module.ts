import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlsModule } from '../../als/als.module';
import { SessionModule } from '../session/session.module';

import { UserEntity } from './entities';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const entities = [UserEntity];

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature(entities), SessionModule, AlsModule]
})
export class UserModule {}
