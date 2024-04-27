import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUserAddress } from '../types/user.types';

export class AddressDto implements IUserAddress {
  @IsString()
  @ApiProperty({ type: 'string', example: 'Cyprus' })
  public country: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'Limassol' })
  public city: string;
}
