import { Customer } from '../entities/customer.entity';

export interface SaveCustomerRequest {
  registrationNumber: string;
  name: string;
  distributor: string;
}

export interface SaveCustomerUseCase {
  execute(request: SaveCustomerRequest): Promise<Customer>;
}
