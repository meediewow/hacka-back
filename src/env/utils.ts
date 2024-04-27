import { defaultEnvVariables } from './constants';
import { EnvVariablesKey, EnvVariablesMap, TypeMappers } from './types';

const typeMappers: TypeMappers = {
  JWT_SECRET: (value: string) => value,
  PORT: (value) => Number(value),
  NODE_ENV: (value) => (value === 'production' ? 'production' : 'development'),
  MONGO_URL: (value) => value,
  AWS_ACCESS_KEY_ID: (value) => value,
  AWS_SECRET_ACCESS_KEY: (value) => value,
  AWS_REGION: (value) => value,
  PASSWORD_SALT: (value) => value
};

const getTypeMapper = <Key extends EnvVariablesKey>(
  key: Key
): TypeMappers[Key] => typeMappers[key];

const isDefined = (value?: string | null): value is string => {
  return value !== undefined && value !== null;
};

/**
 * TODO: refactoring
 * Переменные лежат в памяти и не изменяются, нет смысла мапить каждое обращение к переменной.
 * Лучше всего их один раз замапить при инициализации сервиса.
 * Лучше всего использовать ConfigModule в связке с yup/zod валидаторами и инжектить везде где необходимо собранный конфиг.
 */

export const getEnvSafe = <Key extends EnvVariablesKey>(
  key: Key
): EnvVariablesMap[Key] => {
  const envValue = process.env[key];

  if (isDefined(envValue)) {
    return getTypeMapper(key)(envValue);
  }

  const defaultEnvVariable = defaultEnvVariables[key];
  if (defaultEnvVariable === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return defaultEnvVariable;
};

export const isProduction = () => getEnvSafe('NODE_ENV') === 'production';

export const getSafeEnvVariables = () =>
  Object.keys(typeMappers).reduce((result, rawKey) => {
    const key = rawKey as any;
    result[key] = getEnvSafe(key);

    return result;
  }, {} as EnvVariablesMap);

export const printVariables = <Map extends Record<string, any>>(map: Map) => {
  const keyLength = 14;

  Object.keys(map).forEach((key) => {
    console.log(`${key.padEnd(keyLength)}: ${map[key]}`);
  });
};
