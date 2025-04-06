import { Module } from '@nestjs/common';
import {
  ParsePdfUseCaseImpl,
  PdfParser,
} from './use-cases/implementations/parse-pdf-implementation.use-case';
import { FileModule } from 'src/file/file.module';
import * as pdfParse from 'pdf-parse';

@Module({
  imports: [FileModule],
  providers: [
    {
      provide: 'ParsePdfUseCase',
      useClass: ParsePdfUseCaseImpl,
    },
    {
      provide: 'PdfParser',
      useFactory: (): PdfParser => ({
        parse: async (buffer: Buffer) => {
          const result = await pdfParse(buffer);
          return result.text;
        },
      }),
    },
  ],
  exports: [
    {
      provide: 'ParsePdfUseCase',
      useClass: ParsePdfUseCaseImpl,
    },
  ],
})
export class PdfParserModule {}
