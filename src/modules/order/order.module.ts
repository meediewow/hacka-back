import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlsModule } from '../../als/als.module';
import { UserModule } from '../user/user.module';
import { PetModule } from '../pet/pet.module';
import { TariffsModule } from '../tariffs/tariffs.module';

import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { SitterOrderController } from './sitter-order.controller';
import { ClientOrderController } from './client-order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    AlsModule,
    UserModule,
    PetModule,
    TariffsModule
  ],
  providers: [OrderService],
  controllers: [SitterOrderController, ClientOrderController],
  exports: [OrderService]
})
export class OrderModule {}
