import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class PeriodDto {
  @ApiProperty({ type: 'string', example: '2021-01-01T00:00:00.000Z' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  public start: Date;

  @ApiProperty({ type: 'string', example: '2021-01-01T00:00:00.000Z' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  public end: Date;
}
