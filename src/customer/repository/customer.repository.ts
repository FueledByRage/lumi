import { Customer } from '../entities/customer.entity';
import { Page } from '../../shared/types/persistence.types';
import { FindCustomersByQueryRequest } from './customer-repository.types';

export interface CustomerRepository {
  save(customer: Omit<Customer, 'id'>): Promise<Customer>;
  findByQuery(query: FindCustomersByQueryRequest): Promise<Page<Customer>>;
  findByNumberAndDistributor(
    registrationNumber: string,
    distributor: string,
  ): Promise<Customer | null>;
}
