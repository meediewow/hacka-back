import { ApiProperty } from '@nestjs/swagger';

export class GuardResponseDto {
  @ApiProperty({ type: 'string', example: 'Guarded content' })
  content: string;
}
