import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsString, Max, Min } from 'class-validator';

import { UserDto } from '../../user/dto';
import { ReviewEntity } from '../entities/review.entity';
import { UserEntity } from '../../user/entities';

export class ReviewDto {
  @ApiProperty({ type: UserDto })
  target: UserDto;

  @ApiProperty({ type: UserDto })
  author: UserDto;

  @ApiProperty({ type: 'string', required: false })
  text: string | null;

  @ApiProperty({ type: 'number' })
  @Max(5)
  @Min(1)
  rate: number;

  @ApiProperty({ type: 'string' })
  createdAt: Date;

  constructor(
    entity: ReviewEntity & { target: UserEntity; author: UserEntity }
  ) {
    this.target = UserDto.fromEntity(entity.target);
    this.author = UserDto.fromEntity(entity.author);
    this.text = entity.text;
    this.rate = entity.rate;
    this.createdAt = entity.createdAt;
  }

  static fromEntity(
    entity: ReviewEntity & { target: UserEntity; author: UserEntity }
  ) {
    return new ReviewDto(entity);
  }
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
