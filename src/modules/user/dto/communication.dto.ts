import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUserCommunicationData } from '../types/user.types';

export class CommunicationDto implements IUserCommunicationData {
  @IsString()
  @ApiProperty({ type: 'string', example: '95424242' })
  public phone: string;
}
