import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

export interface GeneratePresignedUrlRequest {
  fileKey: string;
  contentType: string;
}

export interface GetFileReadableUseCase {
  execute(params: GeneratePresignedUrlRequest): Promise<Readable>;
}

@Injectable()
export class GetFileReadableS3UseCaseImpl implements GetFileReadableUseCase {
  constructor(private readonly s3: S3Client) {}

  async execute(params: GeneratePresignedUrlRequest): Promise<Readable> {
    try {
      console.log('params', params);
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: params.fileKey,
      });

      const response = await this.s3.send(command);

      return response.Body as Readable;
    } catch (error) {
      console.error('Erro ao recuperar dados do arquivo:', error);

      throw new Error('Falha ao recuperar o arquivo');
    }
  }
}
