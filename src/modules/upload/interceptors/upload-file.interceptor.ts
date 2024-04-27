import { BadRequestException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { getFileLimits } from '../upload.utils';

export const UploadFileInterceptor = FileInterceptor('file', {
  fileFilter(req: Request, file, callback) {
    const logger = new Logger(UploadFileInterceptor.name);

    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    );

    const fileLimits = getFileLimits(file.mimetype, file.originalname);

    logger.log('Intercepted new file', { file, fileLimits });

    if (!fileLimits) {
      logger.error({ file }, 'Unsupported file type');
      callback(new BadRequestException('Unsupported file type'), false);
      return;
    }

    const fileSize = req.headers?.['content-length'];
    if (fileSize > fileLimits.maxSize) {
      logger.error({ file, fileSize }, 'Max upload size reached');
      callback(
        new BadRequestException(
          `Max allowed size for this type is ${
            fileLimits.maxSize / Math.pow(2, 20)
          } MB`
        ),
        false
      );
      return;
    }

    callback(null, true);
  }
});
