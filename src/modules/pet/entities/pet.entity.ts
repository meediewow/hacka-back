import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

import { PetType } from '../enum/pet-type.enum';
import { UserEntity } from '../../user/entities';

export type PetData = Omit<PetEntity, 'id' | 'createdAt'>;

@Entity()
export class PetEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  type: PetType;

  @Column()
  userId: UserEntity['id'];

  @Column({ nullable: true })
  name: string | null = null;

  @Column({ nullable: true })
  age: number | null = null;

  @Column({ nullable: true })
  comment: string | null = null;

  @CreateDateColumn()
  createdAt: Date;

  constructor(data: PetData) {
    return Object.assign(this, data);
  }
}
