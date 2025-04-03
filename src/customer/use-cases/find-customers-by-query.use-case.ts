import { Customer } from '../entities/customer.entity';
import { Page } from '../../shared/types/persistence.types';

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: number;
  name?: string;
  distributor?: string;
  customerNumber?: string;
}

export interface FindCustomersByQueryUseCase {
  execute(request: FindCustomersByQueryRequest): Promise<Page<Customer>>;
}
