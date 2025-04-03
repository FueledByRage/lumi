import pdfParse from 'pdf-parse';
import { ParsePdfRequest, ParsePdfUseCase } from '../parse-pdf.use-case';
import { GetFileReadableUseCase } from 'src/file/application/get-file-readable.use-case';
import { Readable } from 'stream';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ExtractFileDataUseCaseImpl implements ParsePdfUseCase {
  constructor(
    @Inject('GetFileReadableUseCase')
    private readonly getReadableFile: GetFileReadableUseCase) {}

  async execute({ pdfUrl }: ParsePdfRequest) {
    try {
      const pdfReadable: Readable = await this.getReadableFile.execute({
        fileKey: pdfUrl,
      });

      const chunks: Buffer[] = [];
      for await (const chunk of pdfReadable) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const pdfBuffer = Buffer.concat(chunks);

      const pdfData = await pdfParse(pdfBuffer);

      return JSON.parse(JSON.stringify(pdfData));
    } catch (error) {
      console.error('Erro ao extrair dados do PDF:', error);
      throw new Error('Falha ao processar o arquivo');
    }
  }
}
