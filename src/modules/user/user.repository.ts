import { Injectable } from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { PeriodDto } from '../../network/dto/period.dto';
import { PetType } from '../pet/enum/pet-type.enum';

import { UserEntity } from './entities';
import { SittersRequestDto } from './dto/sitters.dto';

@Injectable()
export class UserRepository extends MongoRepository<UserEntity> {
  constructor(
    @InjectDataSource()
    readonly datasource: DataSource
  ) {
    super(UserEntity, datasource.manager);
  }

  getSittersList(args: SittersRequestDto) {
    return this.aggregate([
      ...(args?.period ? this.getPeriodAggregation(args.period) : []),
      ...(args?.category ? this.getPetTypesAggregation(args.category) : []),
      ...(args?.coordinates
        ? this.getCoordinatesAggregation(args.coordinates)
        : []),
      ...this.getOrdersCountAggregation(),
      ...(args?.sorter ? [{ $sort: args.sorter.toOrder() }] : [])
    ]).toArray();
  }

  private getOrdersCountAggregation() {
    return [
      {
        $lookup: {
          from: 'order_entity',
          localField: '_id',
          foreignField: 'sitterId',
          as: 'allOrders'
        }
      },
      {
        $addFields: {
          'profile.orderCount': { $size: '$allOrders' }
        }
      }
    ];
  }

  private getCoordinatesAggregation(coordinates: number[]) {
    return [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates
          },
          distanceField: 'distance',
          spherical: true
        }
      }
    ];
  }

  private getPetTypesAggregation(petTypes: PetType[]) {
    return [
      {
        $match: {
          'profile.tariff': {
            $elemMatch: {
              category: { $in: petTypes }
            }
          }
        }
      }
    ];
  }

  private getPeriodAggregation(period: PeriodDto) {
    return [
      {
        $lookup: {
          from: 'order_entity',
          localField: '_id',
          foreignField: 'sitterId',
          as: 'orders'
        }
      },
      {
        $project: {
          userId: 1,
          orders: {
            $filter: {
              input: '$orders',
              as: 'order',
              cond: {
                $or: [
                  { $lt: ['$$order.finishAt', period.start] },
                  { $gt: ['$$order.startAt', period.end] }
                ]
              }
            }
          }
        }
      },
      {
        $match: {
          orders: { $size: 0 }
        }
      },
      {
        $project: {
          user_id: 1,
          orders: 1
        }
      }
    ];
  }
}
