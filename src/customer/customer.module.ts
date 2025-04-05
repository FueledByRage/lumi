import { Module } from '@nestjs/common';

import { FindCustomersByQueryUseCaseImpl } from './use-cases/implementations/find-customer-by-query.use-case';
import { CustomerRepositoryImpl } from './repository/implementations/sequelize/customer.repository';
import { SaveCustomerUseCaseImpl } from './use-cases/implementations/save-customer-sequelize.use-case';
import { FindCustomerByNumberAndDistributorOrCreateUseCaseImpl } from './use-cases/implementations/find-by-number-and-distributor-or-create.use-case';
import { DataSource } from 'typeorm';
import { CustomerModel } from './entities/sequelize/customer';
import { CustomerController } from './customer.controller';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'FindCustomersByQueryUseCase',
      useClass: FindCustomersByQueryUseCaseImpl,
    },
    {
      provide: 'CustomerRepository',
      inject: ['DATA_SOURCE'],
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(CustomerModel),
    },
    {
      provide: 'CustomerRepositoryImpl',
      useClass: CustomerRepositoryImpl,
    },
    {
      provide: 'SaveCustomerUseCase',
      useClass: SaveCustomerUseCaseImpl,
    },
    {
      provide: 'FindCustomerByNumberAndDistributorOrCreateUseCase',
      useClass: FindCustomerByNumberAndDistributorOrCreateUseCaseImpl,
    },
  ],
  exports: [
    {
      provide: 'FindCustomersByQueryUseCase',
      useClass: FindCustomersByQueryUseCaseImpl,
    },
    {
      provide: 'CustomerRepository',
      inject: ['DATA_SOURCE'],
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(CustomerModel),
    },
    {
      provide: 'CustomerRepositoryImpl',
      useClass: CustomerRepositoryImpl,
    },
    {
      provide: 'SaveCustomerUseCase',
      useClass: SaveCustomerUseCaseImpl,
    },
    {
      provide: 'FindCustomerByNumberAndDistributorOrCreateUseCase',
      useClass: FindCustomerByNumberAndDistributorOrCreateUseCaseImpl,
    },
  ],
})
export class CustomerModule {}
