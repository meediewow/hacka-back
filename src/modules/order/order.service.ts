import { AsyncLocalStorage } from 'node:async_hooks';

import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException
} from '@nestjs/common';
import { DateTime } from 'luxon';

import { UserEntity } from '../user/entities';
import { UserService } from '../user/user.service';
import { PetService } from '../pet/pet.service';
import { TariffsService } from '../tariffs/tariffs.service';

import { OrderEntity } from './entities/order.entity';
import { OrderRequestDto } from './dto/order.dto';
import { Status } from './enums/status.enum';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.dto';

export class OrderService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository!: MongoRepository<OrderEntity>;

  @Inject(AsyncLocalStorage)
  private readonly userAls!: AsyncLocalStorage<{ user: UserEntity }>;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(PetService)
  private petService!: PetService;

  @Inject(TariffsService)
  private tariffsService!: TariffsService;

  async getSitterOrders(): Promise<OrderEntity[]> {
    const user = this.userAls.getStore().user;

    return this.orderRepository.find({
      where: {
        sitterId: user._id
      },
      order: {
        _id: -1
      }
    });
  }

  async getClientOrders(): Promise<OrderEntity[]> {
    const user = this.userAls.getStore().user;

    return this.orderRepository.find({
      where: {
        clientId: user._id
      },
      order: {
        _id: -1
      }
    });
  }

  async changeSitterStatus(
    args: ChangeOrderStatusRequestDto
  ): Promise<OrderEntity> {
    const sitter = this.userAls.getStore().user;

    const order = await this.findOrderOrFail(args.orderId);

    const ALLOWED_STATUSES_MAP = {
      [Status.NEW]: [Status.CONFIRMED, Status.CANCELED]
    };

    const isSelectedCorrectStatus = ALLOWED_STATUSES_MAP[
      order.status
    ]?.includes(args.status);

    if (!order.sitterId.equals(sitter._id) || !isSelectedCorrectStatus) {
      throw new ForbiddenException();
    }

    order.status = args.status;
    return this.orderRepository.save(order);
  }

  async changeClientStatus(
    args: ChangeOrderStatusRequestDto
  ): Promise<OrderEntity> {
    const client = this.userAls.getStore().user;

    const order = await this.findOrderOrFail(args.orderId);

    const ALLOWED_STATUSES_MAP = {
      [Status.CONFIRMED]: [Status.PROGRESS],
      [Status.PROGRESS]: [Status.COMPLETED]
    };

    const isSelectedCorrectStatus = ALLOWED_STATUSES_MAP[
      order.status
    ]?.includes(args.status);

    if (!order.clientId.equals(client._id) || !isSelectedCorrectStatus) {
      throw new ForbiddenException();
    }

    order.status = args.status;
    return this.orderRepository.save(order);
  }

  async createOrder(data: OrderRequestDto): Promise<OrderEntity> {
    const client = this.userAls.getStore();

    const sitter = await this.userService.findUser({ id: data.sitterId });

    const dayStart = DateTime.fromJSDate(data.dateBegin);
    const dayEnd = DateTime.fromJSDate(data.dateEnd);

    if (dayEnd <= dayStart) {
      throw new BadRequestException('Invalid date range');
    }

    if (!sitter) {
      throw new NotFoundException('Sitter not found');
    }

    const pets = await this.petService.getPetsByIds(data.petIds);

    if (pets.length !== data.petIds.length) {
      throw new NotFoundException('Some pets not found');
    }

    if (sitter.profile?.tariff.length < 1) {
      throw new BadRequestException('Sitter has no tariffs');
    }

    const selectedTariffs = sitter.profile.tariff.filter((tariff) =>
      pets.find((pet) => pet.type === tariff.category)
    );

    const dayPriceBySelectedTariffs = Number(
      selectedTariffs
        .map((tariff) => tariff.pricePerDay)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    );

    const daysCount = dayEnd.diff(dayStart, 'days').days;

    return this.orderRepository.save(
      new OrderEntity({
        ...data,
        clientId: client.user._id,
        status: Status.NEW,
        price: dayPriceBySelectedTariffs * daysCount,
        isPayed: false
      })
    );
  }

  findOrderOrFail(_id: OrderEntity['_id']): Promise<OrderEntity> {
    return this.orderRepository.findOneOrFail({
      where: {
        _id
      }
    });
  }
}
