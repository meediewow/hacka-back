import { createHash } from 'node:crypto';

import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SessionEntity } from './entities';
import { randomString } from './session.utils';

@Injectable()
export class SessionService {
  @InjectRepository(SessionEntity)
  private sessionRepository: MongoRepository<SessionEntity>;

  public async createSession(identifier: string) {
    const sessionEntity = new SessionEntity();

    sessionEntity.expired = '';
    sessionEntity.identifier = identifier;
    sessionEntity.token = createHash('md5')
      .update(randomString(30))
      .digest('hex');

    await this.sessionRepository.save(sessionEntity);

    return sessionEntity;
  }

  public async isValidSession(token: string) {
    const session = await this.getSessionByToken(token);
    return !!session;
  }

  public async getSessionByToken(token: string) {
    return await this.sessionRepository.findOne({ where: { token } });
  }
}
