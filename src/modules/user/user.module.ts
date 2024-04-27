import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionModule } from '../session/session.module';
import { PetModule } from '../pet/pet.module';

import { UserEntity } from './entities';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const entities = [UserEntity];

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature(entities), SessionModule, PetModule]
})
export class UserModule {}
