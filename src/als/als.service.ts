import { AsyncLocalStorage } from 'node:async_hooks';

import { Injectable, NotFoundException } from '@nestjs/common';

import { UserEntity } from '../modules/user/entities';

type Context = {
  user: UserEntity;
};

@Injectable()
export class AlsService extends AsyncLocalStorage<Context> {
  getStore(): Context {
    const store = super.getStore();
    if (!store) {
      throw new NotFoundException('Context is not found');
    }
    return store;
  }
}
