import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface GeneratePresignedUrlRequest {
  key: string;
  contentType: string;
}

export interface GeneratePresignedUrlUseCase {
  execute(params: GeneratePresignedUrlRequest): Promise<string>;
}

export class GetFileReadableS3UseCaseImpl
  implements GeneratePresignedUrlUseCase
{
  constructor(private readonly s3: S3Client) {}

  async execute(params: GeneratePresignedUrlRequest): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: params.key,
        ResponseContentType: params.contentType,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Erro ao gerar URL pré-assinada:', error);
      throw new Error('Não foi possível gerar a URL pré-assinada');
    }
  }
}
