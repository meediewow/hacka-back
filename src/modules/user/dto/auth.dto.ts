import { IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUserAuthData } from '../types/user.types';
import { PetRequestDto } from '../../pet/dto/pet.dto';

export class AuthRequestDto implements IUserAuthData {
  @IsString()
  @ApiProperty({ type: 'string', example: 'i.am.user@example.com' })
  public identifier: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'secret' })
  public password: string;
}

export class RegistrationData {
  @ValidateNested({ each: true })
  @ApiProperty({ type: PetRequestDto, isArray: true })
  pets: PetRequestDto[];
}

export class RegisterRequestDto extends AuthRequestDto {
  @ApiProperty({ type: RegistrationData })
  @ValidateNested()
  data: RegistrationData;
}
