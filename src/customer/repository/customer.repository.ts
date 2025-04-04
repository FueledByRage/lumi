import { Customer } from '../entities/customer.entity';
import { Page } from '../../shared/types/persistence.types';
import { FindCustomersByQueryRequest } from '../use-cases/find-customers-by-query.use-case';

export interface CustomerRepository {
  save(customer: Omit<Customer, 'id' | 'invoices'>): Promise<Customer>;
  findByQuery(query: FindCustomersByQueryRequest): Promise<Page<Customer>>;
  findById(id: number): Promise<Customer | null>;
  findByNumberAndDistributor(
    registrationNumber: string,
    distributor: string,
  ): Promise<Customer | null>;
}
