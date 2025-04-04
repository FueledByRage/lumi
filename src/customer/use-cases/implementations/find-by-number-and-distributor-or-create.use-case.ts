import { Inject, Injectable } from '@nestjs/common';
import { Customer } from 'src/customer/entities/customer.entity';
import {
  FindCustomerByNumberAndDistributorOrCreateUseCase,
  FindCustomerByNumberAndDistributorOrCreateUseCaseRequest,
} from '../find-by-number-and-distributor-or-create.use-case';
import { CustomerRepository } from 'src/customer/repository/customer.repository';

@Injectable()
export class FindCustomerByNumberAndDistributorOrCreateUseCaseImpl
  implements FindCustomerByNumberAndDistributorOrCreateUseCase
{
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute({
    registrationNumber,
    distributor,
  }: FindCustomerByNumberAndDistributorOrCreateUseCaseRequest): Promise<Customer> {
    const customer =
      (await this.customerRepository.findByNumberAndDistributor(
        registrationNumber,
        distributor,
      )) ||
      this.customerRepository.save({
        registrationNumber,
        distributor,
      });
    return customer;
  }
}
