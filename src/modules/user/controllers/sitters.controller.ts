import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SittersService } from '../services/sitters.service';
import { SittersRequestDto, SittersResponseDto } from '../dto/sitters.dto';

@ApiTags('Sitter')
@Controller('sitter')
@Controller()
export class SittersController {
  constructor(private sittersService: SittersService) {}

  @Post('list')
  @ApiBody({ type: SittersRequestDto })
  @ApiResponse({ type: SittersResponseDto })
  public async sittersList(@Body() body: SittersRequestDto) {
    const list = await this.sittersService.getSittersList(body);
    return { list };
  }
}
