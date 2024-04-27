import { SitterDto } from '../dto/sitters.dto';
import { UserEntity } from '../../user/entities';

export const aggregateSitters = (users: UserEntity[]) => {
  return users.map<SitterDto>((user) => {
    const name = user.profile?.name ?? '';
    const photo = user.profile?.photo ?? '';

    return {
      name,
      photo,
      rating: 0,
      address: '',
      countOrders: 0,
      _id: user._id.toHexString()
    };
  });
};
