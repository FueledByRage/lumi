import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { FindCustomersByQueryUseCase } from 'src/customer/use-cases/find-customers-by-query.use-case';
import { Page } from 'src/shared/types/persistence.types';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerController } from '../customer.controller';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  const mockResponse: Page<Customer> = {
    content: [],
    page: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };

  const findCustomersByQueryUseCaseMock: FindCustomersByQueryUseCase = {
    execute: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: 'FindCustomersByQueryUseCase',
          useValue: findCustomersByQueryUseCaseMock,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/customers (GET) should return a list of customers with pagination', async () => {
    const query = {
      query: 'John',
      distributor: 'ABC',
      page: '1',
      pageSize: '10',
    };

    const res = await request(app.getHttpServer())
      .get('/customers')
      .query(query)
      .expect(200);

    expect(res.body).toEqual(mockResponse);
    expect(findCustomersByQueryUseCaseMock.execute).toHaveBeenCalledWith(query);
  });
});
