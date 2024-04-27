import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

import {
  IUser,
  UserRole,
  IUserProfile,
  IUserSitterProfile
} from '../types/user.types';

@Entity()
export class UserEntity implements IUser {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Column()
  public password: string;

  @Column()
  public isSitter: boolean;

  @Column()
  public identifier: string;

  @Column()
  public roles: UserRole[];

  @Column()
  public profile?: IUserProfile;

  @Column()
  public sitterProfile?: IUserSitterProfile;
}
