import { Customer } from '../entities/customer.entity';
import { Page } from '../../shared/types/persistence.types';

export enum FilterEnum {
  CONSUMERS = 'consumers',
  DISTRIBUTORS = 'distributors',
}
export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: string;
  name?: string;
  distributor?: string;
  query?: string;
  type: FilterEnum;
}

export interface FindCustomersByQueryUseCase {
  execute(request: FindCustomersByQueryRequest): Promise<Page<Customer>>;
}
