import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { UploadFileRequest, UploadFileUseCase } from '../upload-file.use-case';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class UploadFileS3UseCaseImpl implements UploadFileUseCase {
  constructor(private readonly s3: S3) {}

  async execute({ file }: UploadFileRequest) {
    try {
      const folder = process.env.S3_FOLDER || 'uploads';
      const extension = file.mimeType.split('/')[1];
      const baseKey = this.generateBaseKey(file.originalName, extension);
      const wholeKey = this.wholeKey(baseKey, folder);

      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: wholeKey,
          Body: file.buffer,
          ContentType: file.mimeType,
        }),
      );

      return {
        key: wholeKey,
        url: await this.getPresignedUrl(wholeKey),
      };
    } catch (error) {
      console.log(error);

      throw new Error('Não foi possível fazer upload do arquivo');
    }
  }

  private generateBaseKey(fileName: string, extension: string): string {
    return `${fileName}-${new Date().getTime()}.${extension}`;
  }

  private wholeKey(key: string, folder: string): string {
    return `${folder}/${key}`;
  }

  async getPresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      return await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
        }),
        { expiresIn },
      );
    } catch (error) {
      console.error('Erro ao gerar URL pré-assinada:', error);

      throw new Error('Não foi possível gerar a URL pré-assinada');
    }
  }
}
