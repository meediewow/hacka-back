import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CoordinatesDto {
  @IsNumber()
  @ApiProperty({ type: 'number', example: 0 })
  public x: number;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 0 })
  public y: number;
}

export class SittersRequestDto {
  @IsNumber()
  @ApiProperty({ type: 'number', example: 1, isArray: true, required: false })
  category: number[];

  @IsNumber()
  @ApiProperty({ type: 'number', example: 0, required: false })
  dateStart: number;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 0, required: false })
  dateEnd: number;

  @IsNumber()
  @ApiProperty({ type: CoordinatesDto, required: false })
  address: CoordinatesDto;
}

export class SitterDto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'xxxxxxxxxxxxxxxxxxx' })
  _id: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'Homer Simpson' })
  name: string;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 10 })
  rating: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: 'number', example: 73 })
  price?: number;

  @IsString()
  @ApiProperty({ type: 'string', example: 'https://btc.ru' })
  photo: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'Limassol, Cyprus' })
  address: string;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 10 })
  countOrders: number;
}

export class SittersResponseDto {
  @ApiProperty({ type: SitterDto, isArray: true })
  list: SitterDto[];
}
