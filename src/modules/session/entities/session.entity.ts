import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class SessionEntity {
  @ObjectIdColumn()
  public id: ObjectId;

  @Column()
  public token: string;

  @Column()
  public expired: string;

  @Column()
  public identifier: string;
}
