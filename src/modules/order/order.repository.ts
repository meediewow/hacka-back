import { DataSource, MongoRepository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '../user/entities';
import { PetEntity } from '../pet/entities/pet.entity';

import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderRepository extends MongoRepository<OrderEntity> {
  constructor(
    @InjectDataSource()
    readonly datasource: DataSource
  ) {
    super(OrderEntity, datasource.manager);
  }

  async getFullOrderById(
    id: OrderEntity['_id']
  ): Promise<
    OrderEntity & { sitter: UserEntity; client: UserEntity; pets: PetEntity[] }
  > {
    const cursor = this.aggregate([
      {
        $match: {
          _id: id
        }
      },
      ...this.lookupSitterAndClient()
    ]).next();
    return cursor as Promise<
      OrderEntity & {
        sitter: UserEntity;
        client: UserEntity;
        pets: PetEntity[];
      }
    >;
  }

  getSitterOrders(sitterId: OrderEntity['sitterId']) {
    return this.aggregate([
      {
        $match: {
          sitterId
        }
      },
      ...this.lookupSitterAndClient(),
      {
        $sort: {
          _id: -1
        }
      }
    ]).toArray() as Promise<
      Array<
        OrderEntity & {
          sitter: UserEntity;
          client: UserEntity;
          pets: PetEntity[];
        }
      >
    >;
  }

  getClientOrders(clientId: OrderEntity['clientId']): Promise<
    Array<
      OrderEntity & {
        sitter: UserEntity;
        client: UserEntity;
        pets: PetEntity[];
      }
    >
  > {
    return this.aggregate([
      {
        $match: {
          clientId
        }
      },
      ...this.lookupSitterAndClient(),
      {
        $sort: {
          _id: -1
        }
      }
    ]).toArray() as Promise<
      Array<
        OrderEntity & {
          sitter: UserEntity;
          client: UserEntity;
          pets: PetEntity[];
        }
      >
    >;
  }

  private lookupSitterAndClient() {
    return [
      {
        $lookup: {
          from: 'user_entity',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: '$client'
      },
      {
        $lookup: {
          from: 'user_entity',
          localField: 'sitterId',
          foreignField: '_id',
          as: 'sitter'
        }
      },
      { $unwind: '$petIds' },
      {
        $lookup: {
          from: 'pet_entity',
          localField: 'petIds',
          foreignField: '_id',
          as: 'pets'
        }
      },
      {
        $unwind: '$sitter'
      }
    ];
  }
}
