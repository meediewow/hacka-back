import { extname } from 'path';
import { createHash } from 'node:crypto';

import { StorageEngine } from 'multer';
import { v4 as uuid } from 'uuid';
import { InternalServerErrorException, Logger } from '@nestjs/common';

import { AwsS3File } from '../interfaces';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

export class AwsS3Storage implements StorageEngine {
  private readonly awsS3Service: AwsS3Service;

  private logger = new Logger(AwsS3Storage.name);

  constructor(awsS3Service: AwsS3Service) {
    this.awsS3Service = awsS3Service;
  }

  async _handleFile(
    request: Express.Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<AwsS3File>) => void
  ): Promise<void> {
    try {
      const hash = createHash('md5');
      file.stream.on('data', (chunk) => {
        hash.update(chunk);
      });
      const key = this.generateKey(file.originalname);

      const { region, url } = await this.awsS3Service.upload({
        key,
        body: file.stream
      });

      callback(null, {
        key,
        region,
        url,
        md5Sum: hash.digest('hex'),
        originalName: file.originalname,
        mimeType: file.mimetype
      });
    } catch (error) {
      this.logger.error(error);
      callback(new InternalServerErrorException());
    }
  }

  async _removeFile(
    request: Express.Request,
    multerFile: Express.Multer.File,
    callback: (error: Error | null) => void
  ): Promise<void> {
    // Multer merges his own file with info passed to cb in handleFile
    // so we need to cast it to AwsS3File
    const file = multerFile as unknown as Express.Multer.File | AwsS3File;

    if (!('key' in file) || !('bucket' in file) || !file.key || !file.bucket) {
      this.logger.error({ file }, 'Can not remove invalid file');

      callback(new InternalServerErrorException());
      return;
    }

    try {
      await this.awsS3Service.delete({
        key: file.key
      });

      callback(null);
    } catch (error) {
      this.logger.error(error);
      callback(new InternalServerErrorException());
    }
  }

  private generateKey(originalName: string): string {
    const extension = extname(originalName);
    const uniqueName = `${uuid()}${extension}`;
    return `${uniqueName}`;
  }
}
