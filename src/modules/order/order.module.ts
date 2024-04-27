import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { PetModule } from '../pet/pet.module';

import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { SitterOrderController } from './controllers/sitter-order.controller';
import { ClientOrderController } from './controllers/client-order.controller';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(() => UserModule),
    PetModule
  ],
  providers: [OrderService, OrderRepository],
  controllers: [SitterOrderController, ClientOrderController],
  exports: [OrderService]
})
export class OrderModule {}
