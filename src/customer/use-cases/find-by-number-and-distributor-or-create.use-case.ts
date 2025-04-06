import { Customer } from '../entities/customer.entity';

export interface FindCustomerByNumberAndDistributorOrCreateUseCaseRequest {
  registrationNumber: string;
  distributor: string;
  customerName: string;
}

export interface FindCustomerByNumberAndDistributorOrCreateUseCase {
  execute(
    request: FindCustomerByNumberAndDistributorOrCreateUseCaseRequest,
  ): Promise<Customer>;
}
