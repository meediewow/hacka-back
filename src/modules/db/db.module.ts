import { TypeOrmModule as TypeOrmModuleUtils } from '@nestjs/typeorm';

import { getEnvSafe } from '../../env';

import { Add2dsphereIndex1714281233967 } from './migrations/1714281233967-add-2dsphere-index';

export const TypeOrmModule = TypeOrmModuleUtils.forRoot({
  type: 'mongodb',
  synchronize: true,
  autoLoadEntities: true,
  url: getEnvSafe('MONGO_URL'),
  migrations: [Add2dsphereIndex1714281233967],
  migrationsRun: true
});
