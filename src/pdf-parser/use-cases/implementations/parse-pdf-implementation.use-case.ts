import * as pdfParse from 'pdf-parse';
import { ParsePdfRequest, ParsePdfUseCase } from '../parse-pdf.use-case';
import { GetFileReadableUseCase } from 'src/file/application/get-file-readable.use-case';
import { Readable } from 'stream';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ParsePdfUseCaseImpl implements ParsePdfUseCase {
  constructor(
    @Inject('GetFileReadableUseCase')
    private readonly getReadableFile: GetFileReadableUseCase,
  ) {}

  async execute({ pdfKey }: ParsePdfRequest) {
    try {
      console.log('Chave do PDF:', pdfKey);
      const pdfReadable: Readable = await this.getReadableFile.execute({
        fileKey: pdfKey,
      });

      const chunks: Buffer[] = [];
      for await (const chunk of pdfReadable) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const pdfBuffer = Buffer.concat(chunks);

      const pdfData = await pdfParse(pdfBuffer);

      return pdfData.text;
    } catch (error) {
      console.error('Erro ao extrair dados do PDF:', error);
      throw new Error('Falha ao processar o arquivo');
    }
  }
}
