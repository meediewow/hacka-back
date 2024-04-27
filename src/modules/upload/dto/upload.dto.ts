import { ApiProperty } from '@nestjs/swagger';

import { AwsS3File } from '../interfaces';

export class UploadDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  url!: string;
  @ApiProperty()
  fileName!: string;
  @ApiProperty()
  mimeType: string;

  constructor(dto: UploadDto) {
    Object.assign(this, dto);
  }

  static fromAwsS3File(file: AwsS3File): UploadDto {
    return new UploadDto({
      id: file.key,
      url: file.url,
      fileName: file.originalName,
      mimeType: file.mimeType
    });
  }
}
