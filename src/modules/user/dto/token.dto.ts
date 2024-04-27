import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ITokenContainer } from '../types/token.types';

export class TokenResponseDto implements ITokenContainer {
  @IsString()
  @ApiProperty({ type: 'string', example: 'Homer' })
  public token: string;
}
