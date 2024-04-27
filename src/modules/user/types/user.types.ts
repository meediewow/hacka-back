export enum UserRole {
  Client = 'sitter',
  Admin = 'client'
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
  id: unknown;
  roles: UserRole[];
  isSitter: boolean;

  profile?: IUserProfile;
  sitterProfile?: IUserSitterProfile;
}

export interface IUserSitterProfile {}

export type IUserLight = Pick<IUser, 'id' | 'profile'>;
