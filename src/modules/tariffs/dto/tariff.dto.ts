import { ApiProperty } from '@nestjs/swagger';

import { TariffDto } from '../../user/dto/profile.dto';

export class TariffsListResponseDto {
  @ApiProperty({ type: TariffDto, isArray: true })
  list: TariffDto[];
}
