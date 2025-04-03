import { Customer } from 'src/customer/entities/customer.entity';
import {
  SaveCustomerRequest,
  SaveCustomerUseCase,
} from '../save-customer.use-case';
import { CustomerRepository } from 'src/customer/repository/customer.repository';

export class SaveCustomerUseCaseImpl implements SaveCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(request: SaveCustomerRequest): Promise<Customer> {
    return await this.customerRepository.save(request);
  }
}
