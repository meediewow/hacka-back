import { Readable } from 'stream';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { AwsS3File } from '../interfaces';
import { getEnvSafe } from '../../../env';

@Injectable()
export class AwsS3Service implements OnModuleInit {
  private readonly logger = new Logger(AwsS3Service.name);

  private client: S3Client;
  private readonly bucket = 'hackaton-xrm';
  private readonly region = getEnvSafe('AWS_REGION');

  onModuleInit(): void {
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: getEnvSafe('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnvSafe('AWS_SECRET_ACCESS_KEY')
      }
    });
  }

  async upload(args: {
    key: string;
    body: Readable | ReadableStream;
  }): Promise<Pick<AwsS3File, 'bucket' | 'key' | 'region' | 'url'>> {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: args.key,
        Body: args.body
      }
    });

    await upload.done();

    const url = this.generateUrl({ bucket: this.bucket, key: args.key });
    return {
      bucket: this.bucket,
      key: args.key,
      region: this.region,
      url
    };
  }

  async delete(args: { key: string }): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: args.key
      })
    );
  }

  private generateUrl(args: { bucket: string; key: string }): string {
    return `https://${args.bucket}.s3.${this.region}.amazonaws.com/${args.key}`;
  }
}
