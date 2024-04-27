import { IsDate, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

import { OrderEntity } from '../entities/order.entity';

export class OrderRequestDto implements Partial<OrderEntity> {
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @IsObject()
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  sitterId: ObjectId;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateBegin: Date;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;

  @ApiProperty({
    type: 'string',
    isArray: true,
    example: ['616f9b3b8f4b3b001f3b3b3b']
  })
  @Transform(({ value }) => value.map((i) => ObjectId.createFromHexString(i)))
  petIds: ObjectId[];
}

export class OrderResponseDto implements Partial<OrderEntity> {
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @Transform(({ value }) => value.toHexString())
  _id: ObjectId;

  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @Transform(({ value }) => value.toHexString())
  clientId: ObjectId;

  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @Transform(({ value }) => value.toHexString())
  sitterId: ObjectId;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @Transform(({ value }) => value.toISOString())
  dateBegin: Date;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @Transform(({ value }) => value.toISOString())
  dateEnd: Date;

  @ApiProperty({
    type: 'string',
    isArray: true,
    example: ['616f9b3b8f4b3b001f3b3b3b']
  })
  @Transform(({ value }) => value.map((i) => String(i)))
  petIds: ObjectId[];

  @ApiProperty({ type: 'number', example: 0 })
  status: number;

  @ApiProperty({ type: 'boolean', example: false })
  isPayed: boolean;

  @ApiProperty({ type: 'number', example: 0 })
  price: number;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;
}
