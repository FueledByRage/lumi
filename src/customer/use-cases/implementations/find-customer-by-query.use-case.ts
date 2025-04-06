import { CustomerRepository } from 'src/customer/repository/customer.repository';
import {
  FindCustomersByQueryRequest,
  FindCustomersByQueryUseCase,
} from '../find-customers-by-query.use-case';

import { Page } from 'src/shared/types/persistence.types';
import { Customer } from 'src/customer/entities/customer.entity';
import { Inject } from '@nestjs/common';

export class FindCustomersByQueryUseCaseImpl
  implements FindCustomersByQueryUseCase
{
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(request: FindCustomersByQueryRequest): Promise<Page<Customer>> {
    return this.customerRepository.findByQuery(request);
  }
}
