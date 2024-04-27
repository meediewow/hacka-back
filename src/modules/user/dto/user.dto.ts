import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUserLight, IUserProfile, UserRole } from '../types/user.types';

import { ProfileDto } from './profile.dto';

export class UserDto implements IUserLight {
  @IsString()
  @ApiProperty({ type: 'string' })
  public _id: string;

  @ApiProperty({ type: 'number', isArray: true })
  public roles: UserRole[];

  @IsOptional()
  @ApiProperty({ type: ProfileDto, required: false })
  public profile?: IUserProfile;
}
