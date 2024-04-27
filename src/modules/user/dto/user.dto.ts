import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { PetResponseDto } from '../../pet/dto/pet.dto';
import { IUserLight, UserRole } from '../types/user.types';

import { ProfileDto } from './profile.dto';

export class UserDto implements IUserLight {
  @IsString()
  @ApiProperty({ type: 'string' })
  public _id: string;

  @ApiProperty({ type: 'number', isArray: true })
  public roles: UserRole[];

  @ApiProperty({ type: PetResponseDto, isArray: true })
  public pets: PetResponseDto[];

  @IsOptional()
  @ApiProperty({ type: ProfileDto, required: false })
  public profile?: ProfileDto;

  @IsNumber()
  @ApiProperty({ type: 'number' })
  public rate: number;
}
