import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlsModule } from '../../als/als.module';
import { SessionModule } from '../session/session.module';
import { PetModule } from '../pet/pet.module';
import { OrderModule } from '../order/order.module';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities';
import { SittersService } from './services/sitters.service';
import { SittersController } from './controllers/sitters.controller';

@Module({
  providers: [UserService, SittersService],
  controllers: [UserController, SittersController],
  exports: [UserService, PetModule, OrderModule],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SessionModule,
    AlsModule,
    PetModule,
    forwardRef(() => OrderModule)
  ]
})
export class UserModule {}
