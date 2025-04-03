import { Module } from '@nestjs/common';

import { FindCustomersByQueryUseCaseImpl } from './use-cases/implementations/find-customer-by-query.use-case';
import { CustomerRepositoryImpl } from './repository/implementations/sequelize/customer.repository';
import { SaveCustomerUseCaseImpl } from './use-cases/implementations/save-customer-sequelize.use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'FindCustomersByQueryUseCase',
      useClass: FindCustomersByQueryUseCaseImpl,
    },
    {
      provide: 'CustomerRepository',
      useClass: CustomerRepositoryImpl,
    },
    {
      provide: 'SaveCustomerUseCase',
      useClass: SaveCustomerUseCaseImpl,
    },
  ],
  exports: [
    {
      provide: 'FindCustomersByQueryUseCase',
      useClass: FindCustomersByQueryUseCaseImpl,
    },
    {
      provide: 'CustomerRepository',
      useClass: CustomerRepositoryImpl,
    },
    {
      provide: 'SaveCustomerUseCase',
      useClass: SaveCustomerUseCaseImpl,
    },
  ],
})
export class CustomerModule {}
