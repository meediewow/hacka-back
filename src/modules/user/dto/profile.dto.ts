import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  IUserAddress,
  IUserProfile,
  IUserCommunicationData
} from '../types/user.types';

import { CommunicationDto } from './communication.dto';

export class ProfileDto implements IUserProfile {
  @IsString()
  @ApiProperty({ type: 'string', example: 'Homer' })
  public firstName: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'Simpson' })
  public lastName: string;

  public address?: IUserAddress;

  @ApiProperty({ type: CommunicationDto })
  public communication: IUserCommunicationData;
}
