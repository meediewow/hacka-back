import { AsyncLocalStorage } from 'node:async_hooks';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UserEntity } from '../user/entities';
import { TariffDto } from '../user/dto/profile.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TariffsService {
  @Inject(UserService)
  private userService!: UserService;

  @Inject(AsyncLocalStorage)
  private readonly als: AsyncLocalStorage<{ user: UserEntity }>;

  public async addTariff(data: TariffDto) {
    const { user } = this.als.getStore();
    const tariff = [...(user.profile?.tariff ?? []), data];
    user.profile = user.profile ? { ...user.profile, tariff } : { tariff };

    await this.userService.updateUser(user);
  }

  public async getUserTariffs(userId: string) {
    const user = await this.userService.findUser({ id: userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.profile?.tariff ?? [];
  }
}
