import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';

import { AwsS3Service } from './aws-s3/aws-s3.service';
import { AwsS3File } from './interfaces';
import { getFileLimits } from './upload.utils';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);

  constructor(private readonly awsS3Service: AwsS3Service) {}

  async findExistingOrCreate(file: AwsS3File): Promise<UploadDto> {
    await this.assertFileLimits(file);

    try {
      return UploadDto.fromAwsS3File(file);
    } catch (error) {
      this.logger.error(error, 'Failed to save file upload');

      await this.awsS3Service.delete({
        key: file.key
      });

      throw new InternalServerErrorException();
    }
  }

  private async assertFileLimits(file: AwsS3File): Promise<void> {
    const fileLimits = getFileLimits(file.mimeType, file.originalName);

    if (!fileLimits) {
      await this.awsS3Service.delete({
        key: file.key
      });

      throw new BadRequestException('Unsupported file type');
    }

    if (file.size > fileLimits.maxSize) {
      this.logger.error(
        'Content-length is not equal to real file size. Deleting...'
      );

      await this.awsS3Service.delete({
        key: file.key
      });

      throw new BadRequestException(
        `Max allowed size for this type is ${
          fileLimits.maxSize / Math.pow(2, 20)
        } MB`
      );
    }
  }
}
