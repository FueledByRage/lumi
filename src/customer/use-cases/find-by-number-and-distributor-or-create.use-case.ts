import { Customer } from '../entities/customer.entity';

export interface FindCustomerByNumberAndDistributorOrCreateUseCaseRequest {
  customerNumber: string;
  distributor: string;
}

export interface FindCustomerByNumberAndDistributorOrCreateUseCase {
  execute(
    request: FindCustomerByNumberAndDistributorOrCreateUseCaseRequest,
  ): Promise<Customer>;
}
