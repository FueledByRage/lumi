import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ReadInvoiceFileUseCaseImplementation } from './use-cases/implementations/read-invoice.use-case';
import { SaveInvoiceUseCaseImpl } from './use-cases/implementations/save-invoice-sequelize.use-case';
import { PdfParserModule } from 'src/pdf-parser/pdf-parser.module';
import { HandleInvoiceUploadUseCaseImpl } from './use-cases/implementations/handle-invoice-upload.use-case';
import { InvoiceController } from './invoice.controller';
import { FileModule } from 'src/file/file.module';
import { ExtractInvoiceDataUseCaseImpl } from './use-cases/implementations/extract-invoice-info.use-case';
import { CustomerModule } from 'src/customer/customer.module';
import { InvoiceRepositoryImpl } from './repository/implementations/invoice-repository-sequelize';
import { InvoiceModel } from './entities/sequelize/invoice.model';
import { DataSource } from 'typeorm';
import { FindDashboardSummaryUseCaseImpl } from './use-cases/implementations/find-dashboard-summary.use-case';
import GetMonthlyDataUseCaseImpl from './use-cases/implementations/get-monthly-data.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'invoice',
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
      provide: 'InvoiceRepository',
      inject: ['DATA_SOURCE'],
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(InvoiceModel),
    },
    {
      provide: 'InvoiceRepositoryImpl',
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
