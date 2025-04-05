import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PdfParserModule } from './pdf-parser/pdf-parser.module';
import { BullModule } from '@nestjs/bullmq';
import { bullConfig } from './configuration/bullmq.config';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from './datasource/typeOrm.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule,
    CustomerModule,
    InvoiceModule,
    PdfParserModule,
    BullModule.forRoot(bullConfig),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
