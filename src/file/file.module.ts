import { Module } from '@nestjs/common';
import { UploadFileS3UseCaseImpl } from './use-cases/implementations/upload-file-s3-use-case';
import { GetFileReadableS3UseCaseImpl } from './use-cases/implementations/get-file-readable-s3.use-case';
import { S3Client } from '@aws-sdk/client-s3';

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
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: process.env.S3_REGION || '',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || '',
            secretAccessKey: process.env.AWS_SECRET_KEY || '',
          },
        });
      },
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
