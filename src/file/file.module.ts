import { Module } from '@nestjs/common';
import { UploadFileS3UseCaseImpl } from './application/implementations/upload-file-s3-use-case';
import { GetFileReadableS3UseCaseImpl } from './application/implementations/get-file-readable-s3.use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'UploadFileUseCase',
      useClass: UploadFileS3UseCaseImpl,
    },
    {
      provide: 'GetFileReadableUseCase',
      useClass: GetFileReadableS3UseCaseImpl,
    },
  ],
  exports: [
    {
      provide: 'UploadFileUseCase',
      useClass: UploadFileS3UseCaseImpl,
    },
    {
      provide: 'GetFileReadableUseCase',
      useClass: GetFileReadableS3UseCaseImpl,
    },
  ],
})
export class FileModule {}
