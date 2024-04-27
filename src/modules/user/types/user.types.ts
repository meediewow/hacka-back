import { PetResponseDto } from '../../pet/dto/pet.dto';
import { PetType } from '../../pet/enum/pet-type.enum';

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
  category: PetType;
  pricePerDay: number;
}

export interface IUserProfile {
  name?: string;
  photo?: string;
  address?: IUserAddress;
  communication?: IUserCommunicationData;

  tariff?: ITariff[];
}

export interface IUser extends IUserAuthData {
  _id: unknown;
  roles: UserRole[];

  pets?: PetResponseDto[];

  rate: number;

  profile?: IUserProfile;
}

export type IUserLight = Omit<IUser, 'password' | 'identifier'>;
