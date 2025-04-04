import { Module } from '@nestjs/common';
import { ParsePdfUseCaseImpl } from './use-cases/implementations/parse-pdf-implementation.use-case';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [FileModule],
  providers: [
    {
      provide: 'ParsePdfUseCase',
      useClass: ParsePdfUseCaseImpl,
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
