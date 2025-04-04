import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PdfParserModule } from './pdf-parser/pdf-parser.module';
import { BullModule } from '@nestjs/bullmq';
import { bullConfig } from './configuration/bullmq.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModel } from './invoice/entities/sequelize/invoice.model';
import { CustomerModel } from './customer/entities/sequelize/customer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [InvoiceModel, CustomerModel],
      synchronize: true,
    }),
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
