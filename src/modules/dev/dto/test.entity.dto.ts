import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestEntityDto {
  @ApiProperty({ type: 'number', example: 42 })
  id: number;

  @ApiProperty({ type: 'string', example: 'test-entity-title' })
  title: string;
}

export class TestEntitiesListResponseDto {
  @ApiProperty({ type: TestEntityDto, isArray: true })
  data: [TestEntityDto];
}

export class TestEntityCreateRequestDto {
  @ApiProperty({ type: 'string', example: 'test-entity-title' })
  @IsString()
  title: string;
}

export class OneEntityResponseDto {
  @ApiProperty({ type: TestEntityDto })
  data: TestEntityDto;
}
