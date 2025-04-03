import { Customer } from '../entities/customer.entity';

export interface FindByIdRequest {
  id: string;
}

export interface FindByIdUseCase {
  execute(request: FindByIdRequest): Promise<Customer>;
}
