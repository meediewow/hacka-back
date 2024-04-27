import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

import { UserEntity } from '../../user/entities';
import { Status } from '../enums/status.enum';

export type OrderData = Omit<OrderEntity, '_id' | 'createdAt'>;

@Entity()
export class OrderEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  clientId: UserEntity['_id'];

  @Column()
  @Index()
  sitterId: UserEntity['_id'];

  @Column()
  startAt: Date;

  @Column()
  finishAt: Date;

  @Column()
  petIds: ObjectId[];

  @Column()
  status: Status;

  @Column()
  isPayed: boolean;

  @Column()
  price: number;

  @Column()
  createdAt: Date;

  constructor(data: OrderData) {
    Object.assign(this, data);
  }
}
