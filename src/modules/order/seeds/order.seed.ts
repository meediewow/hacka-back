import {
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

import { OrderEntity } from '../entities/order.entity';
import { Status } from '../enums/status.enum';
import { UserRepository } from '../../user/user.repository';
import { UserRole } from '../../user/types/user.types';
import { PetService } from '../../pet/pet.service';
import { OrderRepository } from '../order.repository';

@Injectable()
export class OrderSeed implements OnApplicationBootstrap {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;
  @Inject(PetService)
  private readonly petService: PetService;

  @Inject(OrderRepository)
  private readonly orderRepository: OrderRepository;

  async onApplicationBootstrap(): Promise<void> {
    if (this.userRepository) {
      return;
    }

    for (let i = 0; i < 50; i++) {
      await this.seed(faker.number.int({ min: 2, max: 10 }));
    }
  }

  async seed(count: number): Promise<void> {
    const client = await this.userRepository
      .aggregate([
        {
          $match: {
            roles: { $in: [UserRole.Client] }
          }
        },
        { $sample: { size: 1 } }
      ])
      .next();

    if (!client) {
      throw new NotFoundException();
    }

    const clientPets = await this.petService.getPets(client);

    const sitter = await this.userRepository
      .aggregate([
        {
          $match: {
            roles: { $in: [UserRole.Sitter] }
          }
        },
        { $sample: { size: 1 } }
      ])
      .next();

    if (!sitter) {
      throw new NotFoundException();
    }

    const startDate = faker.date.past(2); // Генерируем случайную прошедшую дату за последние 2 года

    const getOrder: () => Partial<OrderEntity> = () => ({
      _id: new ObjectId(),
      status: this.getRandomEnumValue(Status),
      clientId: client._id,
      isPayed: Math.random() > 0.5,
      price: faker.number.float({ min: 10, max: 100 }),
      petIds: clientPets.map((pet) => pet._id),
      startAt: startDate,
      finishAt: new Date(
        startDate.getTime() +
          faker.datatype.number({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000
      ),
      sitterId: sitter._id
    });

    const data = Array.from({ length: count }, getOrder);
    await this.orderRepository.save(data);
  }

  private getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum as any)
      .filter((key) => isNaN(Number(key)))
      .map((key) => anEnum[key]);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }
}
