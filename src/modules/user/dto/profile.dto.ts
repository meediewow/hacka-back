import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { ITariff, IUserProfile } from '../types/user.types';

import { AddressDto } from './address.dto';
import { CommunicationDto } from './communication.dto';

export class TariffDto {
  @IsNumber()
  @ApiProperty({ type: 'number', example: 1 })
  category: number;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 42 })
  pricePerDay: number;
}

export class ProfileDto implements IUserProfile {
  @IsString()
  @ApiProperty({ type: 'string', example: 'Homer' })
  public name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'https://btc.com', required: false })
  public photo?: string;

  @IsOptional()
  @ApiProperty({ type: AddressDto, required: false })
  public address?: AddressDto;

  @ApiProperty({ type: CommunicationDto, required: false })
  public communication?: CommunicationDto;

  @IsOptional()
  @ApiProperty({ type: TariffDto, isArray: true, required: false })
  tariff?: ITariff[];
}

export class TariffsListResponseDto {
  @ApiProperty({ type: TariffDto, required: false, isArray: true })
  list: TariffDto[];
}
