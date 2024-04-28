import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionModule } from '../session/session.module';
import { PetModule } from '../pet/pet.module';
import { OrderModule } from '../order/order.module';
import { getEnvSafe } from '../../env';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities';
import { SittersService } from './services/sitters.service';
import { SittersController } from './controllers/sitters.controller';
import { UserRepository } from './user.repository';
import { UserSeed } from './seeds/user.seed';

@Module({
  providers: [
    UserService,
    SittersService,
    UserRepository,
    ...(getEnvSafe('NODE_ENV') === 'development' ? [UserSeed] : [])
  ],
  controllers: [UserController, SittersController],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SessionModule,
    PetModule,
    forwardRef(() => OrderModule)
  ]
})
export class UserModule {}
