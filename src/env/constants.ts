import { EnvVariablesMap } from './types';

export const defaultEnvVariables: Partial<EnvVariablesMap> = {
  JWT_SECRET: 'salt',
  PORT: 3000,
  NODE_ENV: 'development',
  PASSWORD_SALT: 'salt'
};
