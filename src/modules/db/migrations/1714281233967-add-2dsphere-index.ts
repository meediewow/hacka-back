import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserEntity } from '../../user/entities';

export class Add2dsphereIndex1714281233967 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepository = queryRunner.manager.getMongoRepository(UserEntity);

    await usersRepository.createCollectionIndex({
      location: '2dsphere'
    });
  }

  public async down(): Promise<void> {}
}
