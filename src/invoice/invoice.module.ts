import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ReadInvoiceFileUseCaseImplementation } from './use-cases/implementations/read-invoice.use-case';
import { SaveInvoiceUseCaseImpl } from './use-cases/implementations/save-invoice.use-case';
import { PdfParserModule } from 'src/pdf-parser/pdf-parser.module';
import { HandleInvoiceUploadUseCaseImpl } from './use-cases/implementations/handle-invoice-upload.use-case';
import { InvoiceController } from './invoice.controller';
import { FileModule } from 'src/file/file.module';
import { CustomerModule } from 'src/customer/customer.module';
import { InvoiceRepositoryImpl } from './repository/implementations/typeorm/invoice-repository';
import { InvoiceModel } from './entities/typeorm/invoice.model';
import { DataSource } from 'typeorm';
import { FindDashboardSummaryUseCaseImpl } from './use-cases/implementations/find-dashboard-summary.use-case';
import GetMonthlyDataUseCaseImpl from './use-cases/implementations/get-monthly-data.use-case';
import { Queues } from 'src/shared/types/queues.types';
import { ExtractInvoiceDataUseCaseImpl } from './use-cases/implementations/extract-invoice-info.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.INVOICE,
    }),
    PdfParserModule,
    FileModule,
    CustomerModule,
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
    {
      provide: 'ExtractInvoiceDataUseCase',
      useClass: ExtractInvoiceDataUseCaseImpl,
    },
    {
      provide: 'InvoiceRepositoryTypeOrm',
      inject: ['DATA_SOURCE'],
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(InvoiceModel),
    },
    {
      provide: 'InvoiceRepository',
      useClass: InvoiceRepositoryImpl,
    },
    {
      provide: 'FindDashboardSummaryUseCase',
      useClass: FindDashboardSummaryUseCaseImpl,
    },
    {
      provide: 'GetMonthlyDataUseCase',
      useClass: GetMonthlyDataUseCaseImpl,
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
    {
      provide: 'ExtractInvoiceDataUseCase',
      useClass: ExtractInvoiceDataUseCaseImpl,
    },
  ],
})
export class InvoiceModule {}
