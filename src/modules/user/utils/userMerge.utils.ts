import { UserEntity } from '../entities';
import { UserUpdateRequestDto } from '../dto/user.dto';

const mergeProfile = (
  userProfile: UserEntity['profile'],
  data: UserUpdateRequestDto['profile']
): UserEntity['profile'] => {
  userProfile.name = data?.name ?? userProfile.name;
  userProfile.photo = data?.photo ?? userProfile.photo;
  userProfile.tariff = data?.tariff ?? userProfile.tariff;
  userProfile.address = data?.address ?? userProfile.address;
  userProfile.communication = data?.communication ?? userProfile.communication;

  return userProfile;
};

export const userMutationMerge = (
  user: UserEntity,
  data: UserUpdateRequestDto
): UserEntity => {
  const { about, profile: dataProfile } = data;

  user.about = about ?? user.about;
  user.profile = mergeProfile(user.profile, dataProfile);

  return user;
};
