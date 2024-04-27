import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';

import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { AwsS3Storage } from './storages';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [AwsS3Module],
      useFactory: (awsS3Service: AwsS3Service) => ({
        storage: new AwsS3Storage(awsS3Service)
      }),
      inject: [AwsS3Service]
    }),
    AwsS3Module
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService, AwsS3Module]
})
export class UploadModule {}
