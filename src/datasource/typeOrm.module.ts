import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { CustomerModel } from 'src/customer/entities/typeorm/customer';
import { InvoiceModel } from 'src/invoice/entities/typeorm/invoice.model';

const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      try {
        const dataSource = new DataSource({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [CustomerModel, InvoiceModel],
          synchronize: true,
        });
        await dataSource.initialize();
        console.log('Database connected successfully');
        return dataSource;
      } catch (error) {
        console.log('Error connecting to database');
        throw error;
      }
    },
  },
];

@Global()
@Module({
  imports: [TypeOrmModule],
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class TypeOrmModule {}
