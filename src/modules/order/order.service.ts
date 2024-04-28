import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';

import { UserEntity } from '../user/entities';
import { UserService } from '../user/services/user.service';
import { PetService } from '../pet/pet.service';
import { UserDto } from '../user/dto';
import { AlsService } from '../../als/als.service';
import { UserRole } from '../user/types/user.types';
import { PetType } from '../pet/enum/pet-type.enum';
import { PeriodDto } from '../../network/dto/period.dto';

import { OrderEntity } from './entities/order.entity';
import { OrderRequestDto, OrderResponseDto } from './dto/order.dto';
import { Status } from './enums/status.enum';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.dto';
import { OrderRepository } from './order.repository';
import { PayDto } from './dto/pay.dto';

@Injectable()
export class OrderService {
  @Inject(AlsService)
  private readonly alsService!: AlsService;

  @Inject(forwardRef(() => UserService))
  private userService!: UserService;

  @Inject(PetService)
  private petService!: PetService;

  @Inject(OrderRepository)
  private orderRepository!: OrderRepository;

  async getOrdersCount(userId: UserEntity['_id']): Promise<number> {
    return this.orderRepository.countBy({
      $or: [{ clientId: userId }, { sitterId: userId }]
    });
  }

  async pay(args: PayDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOneOrFail({
      where: { _id: args.orderId }
    });

    const ALLOWED_STATUSES = [Status.CONFIRMED, Status.PROGRESS];
    if (order.isPayed || !ALLOWED_STATUSES.includes(order.status)) {
      throw new BadRequestException('Order already payed or canceled');
    }

    order.isPayed = true;
    await this.orderRepository.save(order);

    return {
      ...order,
      sitter: await this.userService.findUser({ id: order.sitterId }),
      client: await this.userService.findUser({ id: order.clientId }),
      pets: await this.petService.getPetsByIds(order.petIds)
    };
  }

  async getSitterOrderById(id: string): Promise<OrderResponseDto> {
    const result = await this.orderRepository.findOneOrFail({
      where: {
        _id: ObjectId.createFromHexString(id)
      }
    });

    return {
      ...result,
      pets: await this.petService.getPetsByIds(result.petIds),
      sitter: await this.userService.findUser({ id: result.sitterId }),
      client: await this.userService.findUser({ id: result.clientId })
    };
  }

  async getClientOrderById(id: string): Promise<OrderResponseDto> {
    const result = await this.orderRepository.findOneOrFail({
      where: {
        _id: ObjectId.createFromHexString(id)
      }
    });

    if (!result.clientId.equals(this.alsService.getStore().user._id)) {
      throw new ForbiddenException();
    }

    return {
      ...result,
      pets: await this.petService.getPetsByIds(result.petIds),
      sitter: await this.userService.findUser({ id: result.sitterId }),
      client: await this.userService.findUser({ id: result.clientId })
    };
  }

  async getSitterOrders(): Promise<OrderEntity[]> {
    const user = this.alsService.getStore().user;

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
    const user = this.alsService.getStore().user;

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
    const sitter = this.alsService.getStore().user;

    const order = await this.orderRepository.findOneOrFail({
      where: {
        _id: args.orderId
      }
    });

    const ALLOWED_STATUSES_MAP = {
      [Status.NEW]: [Status.CONFIRMED, Status.CANCELED]
    };

    const isSelectedCorrectStatus = ALLOWED_STATUSES_MAP[
      order.status
    ]?.includes(args.status);

    if (!isSelectedCorrectStatus) {
      throw new BadRequestException('Invalid status');
    }

    if (!order.sitterId.equals(sitter._id)) {
      throw new ForbiddenException();
    }

    order.status = args.status;
    const updatedOrder = await this.orderRepository.save(order);
    const client = await this.userService.findUser({ id: order.clientId });

    return {
      ...updatedOrder,
      sitter: UserDto.fromEntity(sitter),
      client,
      pets: await this.petService.getPetsByIds(updatedOrder.petIds)
    };
  }

  async changeClientStatus(
    args: ChangeOrderStatusRequestDto
  ): Promise<OrderResponseDto> {
    const client = this.alsService.getStore().user;

    const order = await this.orderRepository.findOneOrFail({
      where: {
        _id: args.orderId
      }
    });

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
      sitter,
      client: UserDto.fromEntity(client),
      pets: await this.petService.getPetsByIds(updatedOrder.petIds)
    };
  }

  async createOrder(data: OrderRequestDto): Promise<OrderResponseDto> {
    const client = this.alsService.getStore();

    const sitter = await this.userService.findUser({ id: data.sitterId });
    const { period, ...rest } = data;

    const dayStart = DateTime.fromJSDate(period.start);
    const dayEnd = DateTime.fromJSDate(period.end);

    if (dayEnd <= dayStart) {
      throw new BadRequestException('Invalid date range');
    }

    if (!sitter || !sitter.roles.includes(UserRole.Sitter)) {
      throw new NotFoundException('Sitter not found');
    }

    const pets = await this.petService.getPetsByIds(data.petIds);

    if (pets.length !== data.petIds.length) {
      throw new NotFoundException('Some pets not found');
    }

    if ((sitter.profile.tariff?.length ?? 0) < 1) {
      throw new BadRequestException('Sitter has no tariffs');
    }

    const order = await this.orderRepository.save(
      new OrderEntity({
        ...rest,
        startAt: dayStart.toJSDate(),
        finishAt: dayEnd.toJSDate(),
        clientId: client.user._id,
        status: Status.NEW,
        price: this.calculatePrice(
          sitter,
          pets.map((pet) => pet.type),
          period
        ),
        isPayed: false
      })
    );
    return {
      ...order,
      client: await this.userService.findUser({ id: order.clientId }),
      sitter,
      pets
    };
  }

  async calculatePriceForClient(data: OrderRequestDto) {
    const sitter = await this.userService.findUser({ id: data.sitterId });
    const pets = await this.petService.getPetsByIds(data.petIds);
    return {
      price: this.calculatePrice(
        sitter,
        pets.map((pet) => pet.type),
        data.period
      )
    };
  }

  calculatePrice(
    sitter: Pick<UserEntity, 'profile'>,
    petTypes: PetType[],
    period?: PeriodDto
  ): number {
    if (!period) {
      return 0;
    }
    const dayStart = DateTime.fromJSDate(period.start);
    const dayEnd = DateTime.fromJSDate(period.end);

    const selectedTariffs =
      sitter.profile.tariff?.filter((tariff) =>
        petTypes.find((t) => t === tariff.category)
      ) ?? [];

    const dailyPrice = Number(
      selectedTariffs
        .map((tariff) => tariff.pricePerDay)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    );

    const daysCount = dayEnd.diff(dayStart, 'days').days;

    return dailyPrice * daysCount;
  }
}
