import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRepository } from 'src/customer/repository/customer.repository';
import { Customer } from 'src/customer/entities/customer.entity';
import { SaveCustomerUseCaseImpl } from '../save-customer-sequelize.use-case';

describe('SaveCustomerUseCaseImpl', () => {
  let useCase: SaveCustomerUseCaseImpl;
  let customerRepository: jest.Mocked<CustomerRepository>;

  const mockCustomer: Customer = {
    id: 1,
    name: 'John Doe',
    registrationNumber: '123456789',
    distributor: 'ABC',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveCustomerUseCaseImpl,
        {
          provide: 'CustomerRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(SaveCustomerUseCaseImpl);
    customerRepository = module.get('CustomerRepository');
  });

  it('should call customerRepository.save and return the saved customer', async () => {
    const request = {
      name: 'John Doe',
      registrationNumber: '123456789',
      distributor: 'ABC',
    };

    customerRepository.save.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(request);

    expect(result).toEqual(mockCustomer);
    expect(customerRepository.save).toHaveBeenCalledWith(request);
  });
});
