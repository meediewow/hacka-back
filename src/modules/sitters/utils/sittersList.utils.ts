import { SitterDto } from '../dto/sitters.dto';
import { UserEntity } from '../../user/entities';

export const aggregateSitters = (users: UserEntity[]) => {
  return users.map<SitterDto>((user) => {
    const name = user.profile?.name ?? '';
    const photo = user.profile?.photo ?? '';

    return {
      name,
      photo,
      address: '',
      countOrders: 0,
      rating: user.rate ?? 0,
      _id: user._id.toHexString()
    };
  });
};
