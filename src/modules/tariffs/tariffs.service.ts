import { AsyncLocalStorage } from 'node:async_hooks';

import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { UserEntity } from '../user/entities';
import { TariffDto } from '../user/dto/profile.dto';

@Injectable()
export class TariffsService {
  @InjectRepository(UserEntity)
  private userRepository!: MongoRepository<UserEntity>;

  @Inject(AsyncLocalStorage)
  private readonly als: AsyncLocalStorage<{ user: UserEntity }>;

  public async addTariff(data: TariffDto) {
    const { user } = this.als.getStore();
    const tariff = [...(user.profile?.tariff ?? []), data];
    user.profile = user.profile ? { ...user.profile, tariff } : { tariff };

    await this.userRepository.save(user);
  }
}
