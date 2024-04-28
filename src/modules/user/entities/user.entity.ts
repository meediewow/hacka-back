import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

import { IUser, IUserProfile, UserRole } from '../types/user.types';

@Entity()
export class UserEntity implements IUser {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Column()
  public password: string;

  @Column()
  @Index()
  public identifier: string;

  @Column()
  public roles: UserRole[];

  @Column()
  public profile: IUserProfile;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  public location: {
    type: 'Point';
    coordinates: number[];
  } | null;

  @Column()
  public about?: string;
}
