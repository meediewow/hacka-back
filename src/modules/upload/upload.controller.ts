import {
  Controller,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { GuardPost } from '../user/decorators';
import { UserRole } from '../user/types/user.types';

import { UploadService } from './upload.service';
import { UploadFileInterceptor } from './interceptors';
import { AwsS3File } from './interfaces';
import { FileDto } from './dto/file.dto';
import { UploadDto } from './dto/upload.dto';
import { FileIsDefinedValidator } from './validators/file-is-defined.validator';

@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @GuardPost([UserRole.Client, UserRole.Sitter])
  @UseInterceptors(UploadFileInterceptor)
  @ApiTags('Upload')
  @ApiBody({
    description: 'Upload file to AWS S3',
    type: FileDto
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    type: UploadDto,
    description: 'Upload created'
  })
  async commonUploadDocument(
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileIsDefinedValidator()] })
    )
    file: AwsS3File
  ): Promise<UploadDto> {
    return this.uploadService.findExistingOrCreate(file);
  }
}
