import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { PeriodDto } from '../../../network/dto/period.dto';
import { SorterDto } from '../../../network/dto/sorter.dto';
import { PetType } from '../../pet/enum/pet-type.enum';

import { UserDto } from './user.dto';

export class SittersRequestDto {
  @IsNumber(undefined, { each: true })
  @ApiProperty({ type: 'enum', isArray: true, required: false })
  category?: PetType[];

  @ApiProperty({ type: PeriodDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PeriodDto)
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
