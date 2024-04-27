import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlsModule } from '../../als/als.module';
import { SessionModule } from '../session/session.module';
import { PetModule } from '../pet/pet.module';
import { OrderModule } from '../order/order.module';

import { UserEntity } from './entities';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const entities = [UserEntity];

const EntitiesModule = TypeOrmModule.forFeature(entities);

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, EntitiesModule, PetModule, OrderModule],
  imports: [
    EntitiesModule,
    SessionModule,
    AlsModule,
    PetModule,
    forwardRef(() => OrderModule)
  ]
})
export class UserModule {}
