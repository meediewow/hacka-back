import { EnvVariablesMap } from './types';

export const defaultEnvVariables: Partial<EnvVariablesMap> = {
  JWT_SECRET: '',
  PORT: 3000,
  NODE_ENV: 'development'
};
