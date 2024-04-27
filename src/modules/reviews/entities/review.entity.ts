import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

import { ReviewDto } from '../dto/review.dto';

@Entity()
export class ReviewEntity implements ReviewDto {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column()
  text: string;

  @Column()
  date: string;

  @Column()
  rate: number;

  @Column()
  @Index()
  target: ObjectId;
}
