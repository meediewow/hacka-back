import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';

import { PeriodDto } from '../../../network/dto/period.dto';
import { SorterDto } from '../../../network/dto/sorter.dto';

import { UserDto } from './user.dto';

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

export class SittersResponseDto {
  @ApiProperty({ type: UserDto, isArray: true })
  list: UserDto[];
}
