import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRepository } from 'src/customer/repository/customer.repository';
import { Customer } from 'src/customer/entities/customer.entity';
import { FindCustomerByNumberAndDistributorOrCreateUseCaseImpl } from '../find-by-number-and-distributor-or-create.use-case';

describe('FindCustomerByNumberAndDistributorOrCreateUseCaseImpl', () => {
  let useCase: FindCustomerByNumberAndDistributorOrCreateUseCaseImpl;
  let customerRepository: jest.Mocked<CustomerRepository>;

  const mockCustomer: Customer = {
    id: 1,
    name: 'Test Customer',
    registrationNumber: '123456789',
    distributor: 'ABC',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCustomerByNumberAndDistributorOrCreateUseCaseImpl,
        {
          provide: 'CustomerRepository',
          useValue: {
            findByNumberAndDistributor: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(FindCustomerByNumberAndDistributorOrCreateUseCaseImpl);
    customerRepository = module.get('CustomerRepository');
  });

  it('should return existing customer if found', async () => {
    customerRepository.findByNumberAndDistributor.mockResolvedValue(
      mockCustomer,
    );

    const result = await useCase.execute({
      registrationNumber: '123456789',
      distributor: 'ABC',
      customerName: 'Test Customer',
    });

    expect(result).toEqual(mockCustomer);
    expect(customerRepository.findByNumberAndDistributor).toHaveBeenCalledWith(
      '123456789',
      'ABC',
    );
    expect(customerRepository.save).not.toHaveBeenCalled();
  });

  it('should create and return new customer if not found', async () => {
    customerRepository.findByNumberAndDistributor.mockResolvedValue(null);
    customerRepository.save.mockResolvedValue(mockCustomer);

    const result = await useCase.execute({
      registrationNumber: '123456789',
      distributor: 'ABC',
      customerName: 'Test Customer',
    });

    expect(result).toEqual(mockCustomer);
    expect(customerRepository.findByNumberAndDistributor).toHaveBeenCalledWith(
      '123456789',
      'ABC',
    );
    expect(customerRepository.save).toHaveBeenCalledWith({
      registrationNumber: '123456789',
      distributor: 'ABC',
      name: 'Test Customer',
    });
  });
});
