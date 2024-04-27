import { extname } from 'path';

import { FILE_LIMITS } from './upload.constants';

export function getFileLimits(
  mimeType: string,
  originalName: string
): (typeof FILE_LIMITS)[number] {
  const extension = extname(originalName).replace('.', '').toLowerCase();

  return FILE_LIMITS.find(
    (i) =>
      i.mimeType === mimeType &&
      (!i.extensions || i.extensions.includes(extension))
  );
}
