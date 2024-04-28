import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsString } from 'class-validator';

import { UserDto } from '../../user/dto';
import { ReviewEntity } from '../entities/review.entity';

export class ReviewDto {
  @ApiProperty({ type: UserDto })
  target: UserDto;

  @ApiProperty({ type: UserDto })
  author: UserDto;

  @ApiProperty({ type: 'string' })
  text: string;

  @ApiProperty({ type: 'string' })
  date: string;

  @ApiProperty({ type: 'number' })
  rate: number;

  @ApiProperty({ type: 'string' })
  createdAt: Date;
}

export class ReviewsResponseDto {
  @ApiProperty({ type: ReviewDto, isArray: true })
  list: ReviewDto[];
}

export class AddReviewRequestDto {
  @IsObject()
  @ApiProperty({ type: 'string' })
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  targetId: ReviewEntity['targetId'];

  @IsString()
  @ApiProperty({ type: 'string', required: false })
  text?: string;

  @IsNumber()
  @ApiProperty({ type: 'number' })
  rate: number;
}
