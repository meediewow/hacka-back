import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn
} from 'typeorm';

import { UserEntity } from '../../user/entities';

@Entity()
export class ReviewEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  creatorId: UserEntity['_id'];

  @Column()
  text: string;

  @Column()
  rate: number;

  @Column()
  @Index()
  recipientId: UserEntity['_id'];

  @CreateDateColumn()
  createdAt: Date;

  constructor(data: Omit<ReviewEntity, '_id' | 'createdAt'>) {
    Object.assign(this, data);
  }
}
