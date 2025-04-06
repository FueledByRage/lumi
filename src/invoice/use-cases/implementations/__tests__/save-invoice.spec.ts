import { Test, TestingModule } from '@nestjs/testing';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { SaveInvoiceUseCaseImpl } from '../save-invoice.use-case';

describe('SaveInvoiceUseCaseImpl', () => {
  let useCase: SaveInvoiceUseCaseImpl;

  const mockInvoiceRepository = {
    save: jest.fn(),
  };

  const mockFindCustomerUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveInvoiceUseCaseImpl,
        { provide: 'InvoiceRepository', useValue: mockInvoiceRepository },
        {
          provide: 'FindCustomerByNumberAndDistributorOrCreateUseCase',
          useValue: mockFindCustomerUseCase,
        },
      ],
    }).compile();

    useCase = module.get(SaveInvoiceUseCaseImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find/create customer and save invoice', async () => {
    const request = {
      registrationNumber: '123456789',
      distributor: 'CEMIG',
      customerName: 'João da Silva',
      referenceMonth: 'JAN',
      referenceYear: '2024',
      electricityConsumptionKWh: 150,
      electricityCost: 300,
      sceeeEnergyWithICMSKWh: 0,
      sceeeEnergyWithICMSCost: 0,
      compensatedEnergyKWh: 0,
      compensatedEnergyCost: 0,
      publicLightingContributionKWh: 15,
      totalConsumption: 165,
      totalValueWithoutGD: 310,
      gdSavings: 0,
    };

    const customer = { id: 1, name: request.customerName };
    const savedInvoice: Invoice = {
      id: 1,
      customer,
      ...request,
    } as unknown as Invoice;

    mockFindCustomerUseCase.execute.mockResolvedValue(customer);
    mockInvoiceRepository.save.mockResolvedValue(savedInvoice);

    const result = await useCase.execute(request);

    expect(mockFindCustomerUseCase.execute).toHaveBeenCalledWith({
      registrationNumber: request.registrationNumber,
      distributor: request.distributor,
      customerName: request.customerName,
    });

    expect(mockInvoiceRepository.save).toHaveBeenCalledWith({
      ...request,
      customer,
    });

    expect(result).toEqual(savedInvoice);
  });
});
