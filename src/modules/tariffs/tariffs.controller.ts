import { Body, Controller, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardPost, GuardGet } from '../user/decorators';
import { TariffDto } from '../user/dto/profile.dto';
import { UserRole } from '../user/types/user.types';
import { SuccessDto } from '../../network/dto/success.dto';

import { TariffsService } from './tariffs.service';
import { TariffsListResponseDto } from './dto/tariff.dto';

@ApiTags('tariffs')
@Controller('tariffs' + '')
export class TariffsController {
  constructor(private tariffService: TariffsService) {}

  @GuardPost([UserRole.Client, UserRole.Sitter], 'add')
  @ApiResponse({ type: SuccessDto })
  @ApiBody({ type: TariffDto })
  public async addTariff(@Body() body: TariffDto) {
    await this.tariffService.addTariff(body);
    return { success: true };
  }

  @GuardGet([UserRole.Client, UserRole.Sitter], 'list/:userId')
  @ApiParam({ type: 'string', name: 'userId', example: 42 })
  @ApiResponse({ type: TariffsListResponseDto })
  public async getTariffs(@Param() { userId }: { userId: string }) {
    const list = await this.tariffService.getUserTariffs(userId);
    return { list };
  }
}
