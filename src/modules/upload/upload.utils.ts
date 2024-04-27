import { extname } from 'path';

import { FILE_LIMITS } from './upload.constants';

export function getFileLimits(
  mimeType: string,
  originalName: string
): (typeof FILE_LIMITS)[number] {
  const extension = extname(originalName).replace('.', '').toLowerCase();

  const result = FILE_LIMITS.find(
    (i) =>
      i.mimeType === mimeType &&
      (!i.extensions || i.extensions.includes(extension))
  );
  if (!result) {
    throw new Error('File type is not supported');
  }
  return result;
}
