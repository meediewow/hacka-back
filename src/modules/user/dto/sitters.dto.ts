import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PeriodDto } from '../../../network/dto/period.dto';
import { SorterDto } from '../../../network/dto/sorter.dto';

export class SittersRequestDto {
  @IsNumber(undefined, { each: true })
  @ApiProperty({ type: 'number', example: 1, isArray: true, required: false })
  category?: number[];

  @ApiProperty({ type: PeriodDto, required: false })
  @IsOptional()
  @ValidateNested()
  period?: PeriodDto;

  @ApiProperty({ type: 'number', required: false, isArray: true })
  @IsOptional()
  @IsNumber(undefined, { each: true })
  coordinates?: number[];

  @ApiProperty({ type: SorterDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Transform(({ value }) => new SorterDto(value))
  sorter?: SorterDto;
}

export class SitterDto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'xxxxxxxxxxxxxxxxxxx' })
  _id: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'Homer Simpson' })
  name: string;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 10 })
  rating: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: 'number', example: 73 })
  price?: number;

  @IsString()
  @ApiProperty({ type: 'string', example: 'https://btc.ru' })
  photo: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'Limassol, Cyprus' })
  address: string;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 10 })
  countOrders: number;

  constructor(data: SitterDto) {
    this._id = data._id;
    this.name = data.name;
    this.rating = data.rating;
    this.price = data.price;
    this.photo = data.photo;
    this.address = data.address;
    this.countOrders = data.countOrders;
  }

  static fromEntity(entity: SitterDto) {
    return new SitterDto(entity);
  }
}

export class SittersResponseDto {
  @ApiProperty({ type: SitterDto, isArray: true })
  list: SitterDto[];
}
