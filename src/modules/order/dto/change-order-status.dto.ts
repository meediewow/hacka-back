import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { IsEnum, IsObject } from 'class-validator';

import { OrderEntity } from '../entities/order.entity';
import { Status } from '../enums/status.enum';

export class ChangeOrderStatusRequestDto implements Partial<OrderEntity> {
  @IsObject()
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  orderId: ObjectId;

  @ApiProperty({ type: 'string', example: '1' })
  @IsEnum(Status)
  status: number;
}
