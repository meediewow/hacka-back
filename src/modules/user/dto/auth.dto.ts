import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUserAuthData } from '../types/user.types';

export class AuthRequestDto implements IUserAuthData {
  @IsString()
  @ApiProperty({ type: 'string', example: 'i.am.user@example.com' })
  public identifier: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'secret' })
  public password: string;
}

export class RegisterRequestDto implements IUserAuthData {
  @IsString()
  @ApiProperty({ type: 'string', example: 'i.am.user@example.com' })
  public identifier: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'secret' })
  public password: string;
}
