import { Body, Controller } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardPost } from '../user/decorators';
import { TariffDto } from '../user/dto/profile.dto';
import { SuccessDto } from '../../network/dto/success.dto';

import { TariffsService } from './tariffs.service';

@ApiTags('tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private tariffService: TariffsService) {}

  @GuardPost('add')
  @ApiResponse({ type: SuccessDto })
  @ApiBody({ type: TariffDto })
  public async addTariff(@Body() body: TariffDto) {
    await this.tariffService.addTariff(body);
    return { success: true };
  }
}
