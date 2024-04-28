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
  authorId: UserEntity['_id'];

  @Column({ nullable: true })
  text: string | null = null;

  @Column()
  rate: number;

  @Column()
  @Index()
  targetId: UserEntity['_id'];

  @CreateDateColumn()
  createdAt: Date;

  constructor(data: Partial<Omit<ReviewEntity, '_id' | 'createdAt'>>) {
    Object.assign(this, data);
  }
}
