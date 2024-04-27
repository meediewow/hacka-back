import { AsyncLocalStorage } from 'node:async_hooks';

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';

import { UserEntity } from '../user/entities';
import { UserService } from '../user/user.service';
import { PetService } from '../pet/pet.service';
import { UserDto } from '../user/dto';

import { OrderEntity } from './entities/order.entity';
import { OrderRequestDto, OrderResponseDto } from './dto/order.dto';
import { Status } from './enums/status.enum';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.dto';
import { OrderRepository } from './order.repository';

export class OrderService {
  @Inject(AsyncLocalStorage)
  private readonly userAls!: AsyncLocalStorage<{ user: UserEntity }>;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(PetService)
  private petService!: PetService;

  @Inject(OrderRepository)
  private orderRepository!: OrderRepository;

  async getSitterOrderById(id: string): Promise<OrderResponseDto> {
    const result = await this.orderRepository.getFullOrderById(
      ObjectId.createFromHexString(id)
    );

    if (!result.sitterId.equals(this.userAls.getStore().user._id)) {
      throw new ForbiddenException();
    }

    return {
      ...result,
      sitter: UserDto.fromEntity(result.sitter),
      client: UserDto.fromEntity(result.client)
    };
  }

  async getClientOrderById(id: string): Promise<OrderResponseDto> {
    const result = await this.orderRepository.getFullOrderById(
      ObjectId.createFromHexString(id)
    );

    if (!result.clientId.equals(this.userAls.getStore().user._id)) {
      throw new ForbiddenException();
    }

    return {
      ...result,
      sitter: UserDto.fromEntity(result.sitter),
      client: UserDto.fromEntity(result.client)
    };
  }

  async getSitterOrders(): Promise<OrderEntity[]> {
    const user = this.userAls.getStore().user;

    const result = await this.orderRepository.getSitterOrders(user._id);
    return result.map((order) => {
      return {
        ...order,
        sitter: UserDto.fromEntity(order.sitter),
        client: UserDto.fromEntity(order.client)
      };
    });
  }

  async getClientOrders(): Promise<OrderEntity[]> {
    const user = this.userAls.getStore().user;

    const result = await this.orderRepository.getClientOrders(user._id);
    return result.map((order) => {
      return {
        ...order,
        sitter: UserDto.fromEntity(order.sitter),
        client: UserDto.fromEntity(order.client)
      };
    });
  }

  async changeSitterStatus(
    args: ChangeOrderStatusRequestDto
  ): Promise<OrderResponseDto> {
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
    const updatedOrder = await this.orderRepository.save(order);
    const client = await this.userService.findUser({ id: order.clientId });
    return {
      ...updatedOrder,
      sitter: UserDto.fromEntity(sitter),
      client: UserDto.fromEntity(client),
      pets: await this.petService.getPetsByIds(updatedOrder.petIds)
    };
  }

  async changeClientStatus(
    args: ChangeOrderStatusRequestDto
  ): Promise<OrderResponseDto> {
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
    const updatedOrder = await this.orderRepository.save(order);
    const sitter = await this.userService.findUser({ id: order.sitterId });

    return {
      ...updatedOrder,
      sitter: UserDto.fromEntity(sitter),
      client: UserDto.fromEntity(client),
      pets: await this.petService.getPetsByIds(updatedOrder.petIds)
    };
  }

  async createOrder(data: OrderRequestDto): Promise<OrderResponseDto> {
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

    const order = await this.orderRepository.save(
      new OrderEntity({
        ...data,
        clientId: client.user._id,
        status: Status.NEW,
        price: dayPriceBySelectedTariffs * daysCount,
        isPayed: false
      })
    );
    return {
      ...order,
      client: UserDto.fromEntity(client.user),
      sitter: UserDto.fromEntity(sitter),
      pets
    };
  }

  findOrderOrFail(_id: OrderEntity['_id']): Promise<OrderEntity> {
    return this.orderRepository.findOneOrFail({
      where: {
        _id
      }
    });
  }
}
