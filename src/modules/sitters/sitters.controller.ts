import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SittersService } from './sitters.service';
import { SittersRequestDto, SittersResponseDto } from './dto/sitters.dto';

@ApiTags('Sitter')
@Controller('sitter')
@Controller()
export class SittersController {
  constructor(private sittersService: SittersService) {}

  @Post('list')
  @ApiBody({ type: SittersRequestDto })
  @ApiResponse({ type: SittersResponseDto })
  public async sittersList(filters: SittersRequestDto) {
    const list = await this.sittersService.getSittersList(filters);
    return { list };
  }
}
