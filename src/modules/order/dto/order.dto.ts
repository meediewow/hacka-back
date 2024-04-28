import { IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

import { OrderEntity } from '../entities/order.entity';
import { UserDto } from '../../user/dto';
import { PetResponseDto } from '../../pet/dto/pet.dto';
import { PeriodDto } from '../../../network/dto/period.dto';
import { Status } from '../enums/status.enum';

export class BaseOrderRequest {
  @IsObject()
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  orderId: ObjectId;
}

export class OrderRequestDto implements Partial<OrderEntity> {
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @IsObject()
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  sitterId: ObjectId;

  @ApiProperty({ type: PeriodDto })
  period: PeriodDto;

  @ApiProperty({
    type: 'string',
    isArray: true,
    example: ['616f9b3b8f4b3b001f3b3b3b']
  })
  @Transform(({ value }) => value.map((i) => ObjectId.createFromHexString(i)))
  petIds: ObjectId[];
}

export class OrderPrice {
  @ApiProperty({ type: 'number', example: 0 })
  price: number;
}

export class OrderResponseDto
  extends OrderPrice
  implements Partial<OrderEntity>
{
  @ApiProperty({ type: 'string', example: '616f9b3b8f4b3b001f3b3b3b' })
  @Transform(({ value }) => value.toHexString())
  _id: ObjectId;

  @ApiProperty({ type: UserDto })
  client: UserDto;

  @ApiProperty({ type: UserDto })
  sitter: UserDto;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @Transform(({ value }) => value.toISOString())
  startAt: Date;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @Transform(({ value }) => value.toISOString())
  finishAt: Date;

  @ApiProperty({
    type: PetResponseDto,
    isArray: true
  })
  pets: PetResponseDto[];

  @ApiProperty({ type: 'enum', enum: Status })
  status: Status;

  @ApiProperty({ type: 'boolean', example: false })
  isPayed: boolean;

  @ApiProperty({ type: 'string', example: '2021-10-20T00:00:00.000Z' })
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;
}
