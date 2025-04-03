import { Customer } from '../entities/customer.entity';

export interface SaveCustomerRequest {
  customerNumber: string;
  name: string;
  email: string;
  distributor: string;
}

export interface SaveCustomerUseCase {
  execute(request: SaveCustomerRequest): Promise<Customer>;
}
