import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject } from 'class-validator';

import { OrderEntity } from '../entities/order.entity';
import { Status } from '../enums/status.enum';

import { BaseOrderRequest } from './order.dto';

export class ChangeOrderStatusRequestDto
  extends BaseOrderRequest
  implements Partial<OrderEntity>
{
  @IsObject()
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  orderId: OrderEntity['_id'];

  @ApiProperty({ type: 'number', example: '1' })
  @IsEnum(Status)
  status: number;
}
