import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { TariffDto } from '../user/dto/profile.dto';
import { UserService } from '../user/services/user.service';
import { AlsService } from '../../als/als.service';

@Injectable()
export class TariffsService {
  @Inject(UserService)
  private userService!: UserService;

  @Inject(AlsService)
  private readonly als: AlsService;

  public async addTariff(data: TariffDto) {
    const { user } = this.als.getStore();
    const tariff = [...(user.profile?.tariff ?? []), data];
    user.profile = { ...user.profile, tariff };

    await this.userService.updateUser(user);

    return tariff;
  }

  public async getUserTariffs(userId: string) {
    const user = await this.userService.findUser({ id: userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.profile?.tariff ?? [];
  }
}
