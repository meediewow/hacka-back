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
  sitterId: UserEntity['_id'];

  @Column()
  dateBegin: Date;

  @Column()
  dateEnd: Date;

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
