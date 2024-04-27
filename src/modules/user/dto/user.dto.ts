import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUserLight, IUserProfile } from '../types/user.types';

import { ProfileDto } from './profile.dto';

export class UserDto implements IUserLight {
  @IsString()
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: ProfileDto })
  public profile: IUserProfile;
}
