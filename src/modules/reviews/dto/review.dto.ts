import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  @ApiProperty({ type: 'string', required: true })
  @Transform(({ value }) => String(value))
  target: ObjectId;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  name: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  photo: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  text: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  date: string;

  @IsNumber()
  @ApiProperty({ type: 'number', required: true })
  rate: number;
}

export class ReviewsResponseDto {
  @ApiProperty({ type: ReviewDto, isArray: true })
  list: ReviewDto[];
}

export class ReviewsRequestDto {
  @IsString()
  @ApiProperty({ type: 'string', required: true })
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  id: ObjectId;
}

export class AddReviewRequestDto {
  @IsObject()
  @ApiProperty({ type: 'string', required: true })
  @Transform(({ value }) => ObjectId.createFromHexString(value))
  target: ObjectId;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  text: string;

  @IsNumber()
  @ApiProperty({ type: 'number', required: true })
  rate: number;
}
