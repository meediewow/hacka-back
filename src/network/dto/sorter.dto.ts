import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class SorterDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  field: string;

  @ApiProperty({ type: 'enum', enum: Order })
  @IsEnum(Order)
  order: Order;

  constructor(sorter?: SorterDto) {
    Object.assign(this, sorter);
  }

  toOrder() {
    return {
      [this.field]: this.order === Order.ASC ? 1 : -1
    };
  }
}
