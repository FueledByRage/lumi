import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UploadFileRequest, UploadFileUseCase } from '../upload-file.use-case';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UploadFileS3UseCaseImpl implements UploadFileUseCase {
  private readonly logger = new Logger();
  constructor(private readonly s3: S3Client) {}

  async execute({ file }: UploadFileRequest) {
    try {
      const folder = process.env.S3_FOLDER || 'uploads';
      const extension = file.mimetype.split('/')[1];
      const baseKey = this.generateBaseKey(file.originalname, extension);
      const wholeKey = this.wholeKey(baseKey, folder);

      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: wholeKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        key: wholeKey,
        url: await this.getPresignedUrl(wholeKey),
      };
    } catch (error) {
      this.logger.error('Erro ao fazer upload do arquivo para o S3', error);

      throw new Error('Não foi possível fazer upload do arquivo');
    }
  }

  private generateBaseKey(fileName: string, extension: string): string {
    const convertedFileName = Buffer.from(fileName, 'latin1').toString('utf8');
    return `${convertedFileName}-${new Date().getTime()}.${extension}`;
  }

  private wholeKey(key: string, folder: string): string {
    return `${folder}/${key}`;
  }

  private async getPresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      return await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn },
      );
    } catch (error) {
      this.logger.error('Erro ao gerar URL pré-assinada', error);

      throw new Error('Não foi possível gerar a URL pré-assinada');
    }
  }
}
