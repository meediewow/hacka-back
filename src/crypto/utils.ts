import { createHash } from 'node:crypto';

import { UNSAFE_SALT } from './constants';

export const matchPassword = (hash: string, password: string) => {
  return encryptPassword(password) === hash;
};

export const encryptPassword = (password: string) => {
  return createHash('md5')
    .update(password + '_' + UNSAFE_SALT)
    .digest('hex');
};
