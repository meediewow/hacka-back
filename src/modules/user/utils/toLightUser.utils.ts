import { UserEntity } from '../entities';
import { IUserLight } from '../types/user.types';
import { PetResponseDto } from '../../pet/dto/pet.dto';

export const toLightUser = (
  user: UserEntity,
  pets: PetResponseDto[] = []
): IUserLight => {
  return {
    pets: pets,
    _id: user._id,
    roles: user.roles,
    rate: user.rate ?? 0,
    profile: user.profile,
    about: user.about ?? ''
  };
};
