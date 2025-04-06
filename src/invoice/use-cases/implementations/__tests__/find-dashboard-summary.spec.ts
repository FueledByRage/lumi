import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceRepository } from 'src/invoice/repository/invoice.repository';
import { FindDashboardSummaryUseCaseImpl } from '../find-dashboard-summary.use-case';
import {
  FindDashboardSummaryRequest,
  FindDashboardSummaryResponse,
} from '../../find-dashboard-summary.use-case';

describe('FindDashboardSummaryUseCaseImpl', () => {
  let useCase: FindDashboardSummaryUseCaseImpl;
  let invoiceRepository: jest.Mocked<InvoiceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindDashboardSummaryUseCaseImpl,
        {
          provide: 'InvoiceRepository',
          useValue: {
            getDashboardSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(FindDashboardSummaryUseCaseImpl);
    invoiceRepository = module.get('InvoiceRepository');
  });

  it('should call invoiceRepository.getDashboardSummary with correct params', async () => {
    const request: FindDashboardSummaryRequest = {
      customerId: 1,
      year: '2023',
      month: 'JAN',
    };

    const expectedResponse: FindDashboardSummaryResponse = {
      totalEnergy: 1000,
      totalValue: 2000,
      averageCostPerKWh: 2,
      invoiceCount: 10,
      compensatedValue: 500,
    };

    invoiceRepository.getDashboardSummary.mockResolvedValue(expectedResponse);

    const result = await useCase.execute(request);

    expect(invoiceRepository.getDashboardSummary).toHaveBeenCalledWith(request);
    expect(result).toEqual(expectedResponse);
  });
});
