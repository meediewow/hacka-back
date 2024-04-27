import { PetResponseDto } from '../../pet/dto/pet.dto';

export enum UserRole {
  Client = 1,
  Sitter = 2
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

export interface ITariff {
  category: number;
  pricePerDay: number;
}

export interface IUserProfile {
  name?: string;
  address?: IUserAddress;
  communication?: IUserCommunicationData;

  tariff?: ITariff[];
}

export interface IUser extends IUserAuthData {
  _id: unknown;
  roles: UserRole[];

  pets?: PetResponseDto[];

  profile?: IUserProfile;
}

export type IUserLight = Omit<IUser, 'password' | 'identifier'>;
