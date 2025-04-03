import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ReadInvoiceFileUseCaseImplementation } from './use-cases/implementations/read-invoice.use-case';
import { SaveInvoiceUseCaseImpl } from './use-cases/implementations/save-invoice-sequelize.use-case';
import { PdfParserModule } from 'src/pdf-parser/pdf-parser.module';
import { HandleInvoiceUploadUseCaseImpl } from './use-cases/implementations/handle-invoice-upload.use-case';
import { InvoiceController } from './invoice.controller';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'invoice',
    }),
    PdfParserModule,
    FileModule,
  ],
  controllers: [InvoiceController],
  providers: [
    {
      provide: 'ReadInvoiceFileUseCase',
      useClass: ReadInvoiceFileUseCaseImplementation,
    },
    {
      provide: 'SaveInvoiceUseCase',
      useClass: SaveInvoiceUseCaseImpl,
    },
    {
      provide: 'HandleInvoiceUploadUseCase',
      useClass: HandleInvoiceUploadUseCaseImpl,
    },
  ],
  exports: [
    {
      provide: 'ReadInvoiceFileUseCase',
      useClass: ReadInvoiceFileUseCaseImplementation,
    },
    {
      provide: 'SaveInvoiceUseCase',
      useClass: SaveInvoiceUseCaseImpl,
    },
    {
      provide: 'HandleInvoiceUploadUseCase',
      useClass: HandleInvoiceUploadUseCaseImpl,
    },
  ],
})
export class InvoiceModule {}
