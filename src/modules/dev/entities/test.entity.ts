import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class TestEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  title: string;
}
