import { Injectable } from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { PeriodDto } from '../../network/dto/period.dto';
import { PetType } from '../pet/enum/pet-type.enum';
import { Status } from '../order/enums/status.enum';

import { UserEntity } from './entities';
import { SittersRequestDto } from './dto/sitters.dto';
import { UserRole } from './types/user.types';

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
      ...(args?.coordinates?.length
        ? this.getCoordinatesAggregation(args.coordinates)
        : []),
      {
        $match: {
          roles: { $in: [UserRole.Sitter] }
        }
      },
      ...(args?.category?.length
        ? this.getPetTypesAggregation(args.category)
        : []),
      ...(args?.period ? this.getPeriodAggregation(args.period) : []),
      ...this.getOrdersCountAggregation(),
      ...this.getAvgRateAggregation(),
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
          'profile.ordersCount': { $size: '$allOrders' }
        }
      }
    ];
  }

  private getAvgRateAggregation() {
    return [
      {
        $lookup: {
          from: 'review_entity',
          localField: '_id',
          foreignField: 'targetId',
          as: 'reviews'
        }
      },
      {
        $unwind: {
          path: '$reviews',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          originalDoc: { $first: '$$ROOT' },
          averageRate: {
            $avg: '$reviews.rate'
          }
        }
      },
      {
        $addFields: {
          originalDoc: {
            $mergeObjects: ['$originalDoc', { rate: '$averageRate' }]
          }
        }
      },
      {
        $replaceRoot: { newRoot: '$originalDoc' }
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

  private getPeriodAggregation(period?: PeriodDto) {
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
        $addFields: {
          orders: {
            $filter: {
              input: '$orders',
              as: 'order',
              cond: {
                $and: [
                  period
                    ? {
                        $or: [
                          { $lt: ['$$order.finishAt', period.start] },
                          { $gt: ['$$order.startAt', period.end] }
                        ]
                      }
                    : {
                        $gt: ['$$order.startAt', new Date()]
                      },
                  {
                    $in: ['$$order.status', [Status.PROGRESS, Status.CONFIRMED]]
                  }
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
      }
    ];
  }
}
