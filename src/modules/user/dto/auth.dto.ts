import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

import { IUserAuthData } from '../types/user.types';
import { PetRequestDto } from '../../pet/dto/pet.dto';

import { ProfileDto } from './profile.dto';

export class AuthRequestDto implements IUserAuthData {
  @ApiProperty({ type: 'string', example: 'i.am.user@example.com' })
  public identifier: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'secret' })
  public password: string;
}

export class RegisterRequestDto extends AuthRequestDto {
  @ValidateNested({ each: true })
  @IsOptional()
  @ApiProperty({ type: PetRequestDto, isArray: true, required: false })
  pets: PetRequestDto[];

  @ApiProperty({ type: 'number', required: false, example: 1 })
  @IsOptional()
  role?: number;

  @ApiProperty({ type: ProfileDto })
  @ValidateNested()
  profile!: ProfileDto;

  @IsString()
  @ApiProperty({ type: 'string', example: 'about me' })
  @IsOptional()
  public about?: string;

  @ApiProperty({ type: 'number', required: false, isArray: true })
  @IsOptional()
  @IsNumber(undefined, { each: true })
  coordinates?: number[];
}
