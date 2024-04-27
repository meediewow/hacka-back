import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

import { IUserLight, UserRole } from '../types/user.types';
import { PetResponseDto } from '../../pet/dto/pet.dto';
import { UserEntity } from '../entities';

import { ProfileDto } from './profile.dto';

export class UserDto implements IUserLight {
  @IsString()
  @ApiProperty({ type: 'string' })
  @Transform(({ value }) => String(value))
  public _id: ObjectId;

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

  constructor(data: UserEntity & { pets?: PetResponseDto[] }) {
    this._id = data._id;
    this.roles = data.roles;
    this.pets = data.pets;
    this.profile = data.profile;
  }

  static fromEntity(entity: UserEntity & { pets?: PetResponseDto[] }): UserDto {
    return new UserDto(entity);
  }
}
