import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ListQueryParams } from '../types';

export class ListQueryParamsDto implements ListQueryParams {
  @IsOptional()
  @ApiProperty({ type: 'number', example: 42, required: false })
  limit: number;

  @IsOptional()
  @ApiProperty({ type: 'number', example: 0, required: false })
  offset: number;
}
