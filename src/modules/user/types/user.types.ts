export enum UserRole {
  Client = 1,
  Sitter = 2,
  Admin = 3
}

export type IUserCommunicationData = {
  phone: string;
};

export interface IUserAddress {
  city: string;
  country: string;
}

export interface IUserAuthData {
  identifier: string;
  password: string;
}

export interface IUserProfile {
  firstName: string;
  lastName: string;

  address?: IUserAddress;
  communication: IUserCommunicationData;
}

export interface IUser extends IUserAuthData {
  _id: unknown;
  roles: UserRole[];

  profile?: IUserProfile;
  sitterProfile?: IUserSitterProfile;
}

export interface IUserSitterProfile {}

export type IUserLight = Pick<IUser, '_id' | 'profile'>;
