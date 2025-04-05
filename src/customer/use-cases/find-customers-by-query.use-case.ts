import { Customer } from '../entities/customer.entity';
import { Page } from '../../shared/types/persistence.types';

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: string;
  name?: string;
  distributor?: string;
  registrationNumber?: string;
}

export interface FindCustomersByQueryUseCase {
  execute(request: FindCustomersByQueryRequest): Promise<Page<Customer>>;
}
