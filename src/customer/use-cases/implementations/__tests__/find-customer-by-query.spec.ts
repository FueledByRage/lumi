import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRepository } from 'src/customer/repository/customer.repository';
import { Customer } from 'src/customer/entities/customer.entity';
import { Page } from 'src/shared/types/persistence.types';
import { FindCustomersByQueryUseCaseImpl } from '../find-customer-by-query.use-case';
import { FilterEnum } from '../../find-customers-by-query.use-case';

describe('FindCustomersByQueryUseCaseImpl', () => {
  let useCase: FindCustomersByQueryUseCaseImpl;
  let customerRepository: jest.Mocked<CustomerRepository>;

  const mockPage: Page<Customer> = {
    content: [],
    page: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCustomersByQueryUseCaseImpl,
        {
          provide: 'CustomerRepository',
          useValue: {
            findByQuery: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(FindCustomersByQueryUseCaseImpl);
    customerRepository = module.get('CustomerRepository');
  });

  it('should call customerRepository.findByQuery and return the result', async () => {
    const request = {
      page: 1,
      pageSize: 10,
      year: '2023',
      type: FilterEnum.CONSUMERS,
      distributor: 'ABC',
    };

    customerRepository.findByQuery.mockResolvedValue(mockPage);

    const result = await useCase.execute(request);

    expect(result).toEqual(mockPage);
    expect(customerRepository.findByQuery).toHaveBeenCalledWith(request);
  });
});
