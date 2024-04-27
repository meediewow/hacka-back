import { ApiProperty } from '@nestjs/swagger';

export class PingResponseDto {
  @ApiProperty({ type: 'string', example: 'pong' })
  content: 'pong';
}
