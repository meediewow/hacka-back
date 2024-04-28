import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

import { IUserUpdateData, UserRole } from '../types/user.types';
import { PetResponseDto } from '../../pet/dto/pet.dto';
import { UserEntity } from '../entities';

import { ProfileDto } from './profile.dto';

export class UserDto {
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
  public profile: ProfileDto;

  @ApiProperty({ type: 'number', required: false, isArray: true })
  public coordinates: number[];

  @IsNumber()
  @ApiProperty({ type: 'number' })
  public rate: number;

  @IsString()
  @ApiProperty({ type: 'string' })
  public about?: string;

  constructor(data: UserEntity & { pets: PetResponseDto[] }) {
    this._id = data._id;
    this.roles = data.roles;
    this.pets = data.pets;
    this.profile = data.profile;
  }

  static fromEntity(entity: UserEntity & { pets?: PetResponseDto[] }): UserDto {
    return new UserDto({ ...entity, pets: entity.pets ?? [] });
  }
}

export class UserUpdateRequestDto implements IUserUpdateData {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'new text about me' })
  public about?: string;

  @IsOptional()
  @ApiProperty({ type: ProfileDto, required: false })
  public profile?: ProfileDto;

  @IsOptional()
  @IsNumber(undefined, { each: true })
  @ApiProperty({ type: 'number', required: false, isArray: true })
  public coordinates?: number[];

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ type: 'enum' })
  role?: UserRole;
}
