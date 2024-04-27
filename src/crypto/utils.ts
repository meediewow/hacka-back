import { createHash } from 'node:crypto';

import { getEnvSafe } from '../env';

export const matchPassword = (hash: string, password: string) => {
  return encryptPassword(password) === hash;
};

export const encryptPassword = (password: string) => {
  return createHash('md5')
    .update(password + '_' + getEnvSafe('PASSWORD_SALT'))
    .digest('hex');
};
