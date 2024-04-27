import { TypeOrmModule as TypeOrmModuleUtils } from '@nestjs/typeorm';

import { getEnvSafe } from '../../env';

export const TypeOrmModule = TypeOrmModuleUtils.forRoot({
  type: 'mongodb',
  synchronize: true,
  autoLoadEntities: true,
  url: getEnvSafe('MONGO_URL')
});
