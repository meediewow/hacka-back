import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PetEntity } from '../entities/pet.entity';
import { PetType } from '../enum/pet-type.enum';

export class PetRequestDto implements Partial<PetEntity> {
  @ApiProperty({ type: 'string', example: 'Fluffy' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: 'enum', enum: PetType })
  @IsEnum(PetType)
  type: PetType;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumber()
  age: number | null = null;

  @ApiProperty({ type: 'string', example: 'Any comment' })
  @IsOptional()
  @IsString()
  comment: string | null = null;
}

export class AddPetsRequestDto {
  @ApiProperty({ type: PetRequestDto, isArray: true })
  pets: PetRequestDto[];
}

export class RemovePetRequestDto {
  @ApiProperty({ type: 'string', example: '662d0cc3387c017a98c6a081' })
  @Transform(({ value }) => String(value))
  _id: ObjectId;
}

export class PetResponseDto implements Partial<PetEntity> {
  @ApiProperty({ type: 'string', example: '662d0cc3387c017a98c6a081' })
  @Transform(({ value }) => String(value))
  _id: ObjectId;

  @ApiProperty({ type: 'number', example: 1 })
  type: PetType;

  @ApiProperty({ type: 'number', example: 1 })
  age: number | null = null;

  @ApiProperty({ type: 'string', example: 'Fluffy' })
  name: string | null = null;
}
