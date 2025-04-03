import { Module } from '@nestjs/common';
import { ExtractFileDataUseCaseImpl } from './use-cases/implementations/parse-pdf-implementation.use-case';

@Module({
  imports: [],
  providers: [
    {
      provide: 'ParsePdfUseCase',
      useClass: ExtractFileDataUseCaseImpl,
    },
  ],
  exports: [
    {
      provide: 'ParsePdfUseCase',
      useClass: ExtractFileDataUseCaseImpl,
    },
  ],
})
export class PdfParserModule {}
