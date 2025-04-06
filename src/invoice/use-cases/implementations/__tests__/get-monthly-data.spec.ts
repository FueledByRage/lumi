import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceRepository } from 'src/invoice/repository/invoice.repository';
import GetMonthlyDataUseCaseImpl from '../get-monthly-data.use-case';
import {
  GetMonthlyDataUseCaseRequest,
  GetMonthlyDataUseCaseResponse,
} from '../../get-monthly-data.use-case';

describe('GetMonthlyDataUseCaseImpl', () => {
  let useCase: GetMonthlyDataUseCaseImpl;
  let invoiceRepository: jest.Mocked<InvoiceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMonthlyDataUseCaseImpl,
        {
          provide: 'InvoiceRepository',
          useValue: {
            getMonthlyData: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetMonthlyDataUseCaseImpl);
    invoiceRepository = module.get('InvoiceRepository');
  });

  it('should call invoiceRepository.getMonthlyData with correct params and return result', async () => {
    const request: GetMonthlyDataUseCaseRequest = {
      customerId: 1,
      year: 2024,
    };

    const expectedResponse: GetMonthlyDataUseCaseResponse = {
      consumption: [
        { month: 'JAN', value: 230.5 },
        { month: 'FEV', value: 210.0 },
      ],
      compensation: [
        { month: 'JAN', value: 50.0 },
        { month: 'FEV', value: 40.0 },
      ],
    };

    invoiceRepository.getMonthlyData.mockResolvedValue(expectedResponse);

    const result = await useCase.execute(request);

    expect(invoiceRepository.getMonthlyData).toHaveBeenCalledWith(1, 2024);
    expect(result).toEqual(expectedResponse);
  });
});
