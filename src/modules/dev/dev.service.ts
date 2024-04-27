import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TestEntity } from './entities/test.entity';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(TestEntity)
    private testRepository: MongoRepository<TestEntity>
  ) {}

  pong() {
    return 'pong';
  }

  async createEntity(title: string) {
    const testEntity = new TestEntity();
    testEntity.title = title;

    return await this.testRepository.save(testEntity);
  }

  async getAllEntities() {
    return await this.testRepository.find();
  }
}
