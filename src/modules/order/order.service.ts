import { AsyncLocalStorage } from 'node:async_hooks';

import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';

import { UserEntity } from '../user/entities';
import { UserService } from '../user/user.service';
import { PetService } from '../pet/pet.service';

import { OrderEntity } from './entities/order.entity';
import { OrderRequestDto } from './dto/order.dto';
import { Status } from './enums/status.enum';

export class OrderService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository!: MongoRepository<OrderEntity>;

  @Inject(AsyncLocalStorage)
  private readonly userAls!: AsyncLocalStorage<{ user: UserEntity }>;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(PetService)
  private petService!: PetService;

  async createOrder(data: OrderRequestDto): Promise<OrderEntity> {
    const client = this.userAls.getStore();

    const sitter = await this.userService.findUser({ id: data.sitterId });

    if (!sitter) {
      throw new NotFoundException('Sitter not found');
    }

    const pets = await this.petService.getPetsByIds(data.petIds);

    if (pets.length !== data.petIds.length) {
      throw new NotFoundException('Some pets not found');
    }

    return this.orderRepository.save(
      new OrderEntity({
        ...data,
        clientId: client.user._id,
        status: Status.NEW,
        price: 0,
        isPayed: false
      })
    );
  }
}
