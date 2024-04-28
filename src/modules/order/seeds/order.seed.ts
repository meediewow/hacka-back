import {
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

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
    await this.seed();
  }

  async seed(): Promise<void> {
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

    const sitters = await this.userRepository
      .aggregate([
        {
          $match: {
            roles: { $in: [UserRole.Sitter] }
          }
        },
        { $sample: { size: 100 } }
      ])
      .toArray();

    if (sitters.length === 0) {
      return;
    }

    let result: Partial<OrderEntity>[] = [];

    for (const sitter of sitters) {
      const getOrder: () => Partial<OrderEntity> = () => {
        const startDate = faker.date.between({
          from: DateTime.now().minus({ year: 2 }).toJSDate(),
          to: DateTime.now().minus({ year: 1 }).toJSDate()
        }); // Генерируем случайную прошедшую дату за последние 2 года

        const _startDate = DateTime.fromJSDate(startDate);
        const endData = _startDate
          .plus({ days: faker.number.int({ min: 1, max: 14 }) })
          .toJSDate();

        return {
          status: this.getRandomEnumValue(Status),
          clientId: client._id,
          isPayed: Math.random() > 0.5,
          price: faker.number.float({ min: 10, max: 100 }),
          petIds: clientPets.map((pet) => pet._id),
          startAt: startDate,
          finishAt: endData,
          sitterId: sitter._id
        };
      };

      result = [
        ...result,
        ...Array.from(
          { length: faker.number.int({ min: 2, max: 5 }) },
          getOrder
        )
      ];
    }

    await this.orderRepository.save(result);
  }

  private getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum as any)
      .filter((key) => isNaN(Number(key)))
      .map((key) => anEnum[key]);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }
}
