import { ParsePdfRequest, ParsePdfUseCase } from '../parse-pdf.use-case';
import { GetFileReadableUseCase } from 'src/file/use-cases/get-file-readable.use-case';
import { Readable } from 'stream';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface PdfParser {
  parse(buffer: Buffer): Promise<string>;
}
@Injectable()
export class ParsePdfUseCaseImpl implements ParsePdfUseCase {
  private readonly logger = new Logger();
  constructor(
    @Inject('GetFileReadableUseCase')
    private readonly getReadableFile: GetFileReadableUseCase,
    @Inject('PdfParser')
    private readonly pdfParser: PdfParser,
  ) {}

  async execute({ pdfKey }: ParsePdfRequest) {
    try {
      const pdfReadable: Readable = await this.getReadableFile.execute({
        fileKey: pdfKey,
      });

      const chunks: Buffer[] = [];

      for await (const chunk of pdfReadable) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const pdfBuffer = Buffer.concat(chunks);

      return await this.pdfParser.parse(pdfBuffer);
    } catch (error) {
      this.logger.error('Error parsing PDF', error);

      throw new Error('Falha ao processar o arquivo');
    }
  }
}
