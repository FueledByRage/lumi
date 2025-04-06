import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { ReadInvoiceFileUseCaseImplementation } from '../read-invoice.use-case';

describe('ReadInvoiceFileUseCaseImplementation', () => {
  let useCase: ReadInvoiceFileUseCaseImplementation;

  const mockParsePdfUseCase = {
    execute: jest.fn(),
  };

  const mockExtractInvoiceDataUseCase = {
    execute: jest.fn(),
  };

  const mockSaveInvoiceUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadInvoiceFileUseCaseImplementation,
        { provide: 'ParsePdfUseCase', useValue: mockParsePdfUseCase },
        {
          provide: 'ExtractInvoiceDataUseCase',
          useValue: mockExtractInvoiceDataUseCase,
        },
        { provide: 'SaveInvoiceUseCase', useValue: mockSaveInvoiceUseCase },
      ],
    }).compile();

    useCase = module.get(ReadInvoiceFileUseCaseImplementation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process and save invoice data', async () => {
    const key = 'invoice-file-key.pdf';
    const fakeText = 'some parsed pdf text';
    const fakeExtractedData = {
      registrationNumber: '1234567890',
      customerName: 'John Doe',
      date: 'MAR/2024',
      referenceMonth: 'MAR',
      referenceYear: '2024',
      distributor: 'CEMIG',
      electricityConsumptionKWh: 100,
      electricityCost: 200,
      sceeeEnergyWithICMSKWh: 0,
      sceeeEnergyWithICMSCost: 0,
      compensatedEnergyKWh: 0,
      compensatedEnergyCost: 0,
      publicLightingContributionKWh: 10,
      totalConsumption: 100,
      totalValueWithoutGD: 210,
      gdSavings: 0,
    };

    mockParsePdfUseCase.execute.mockResolvedValue(fakeText);
    mockExtractInvoiceDataUseCase.execute.mockReturnValue(fakeExtractedData);
    mockSaveInvoiceUseCase.execute.mockResolvedValue(undefined);

    await useCase.execute({ key });

    expect(mockParsePdfUseCase.execute).toHaveBeenCalledWith({ pdfKey: key });
    expect(mockExtractInvoiceDataUseCase.execute).toHaveBeenCalledWith(
      fakeText,
    );
    expect(mockSaveInvoiceUseCase.execute).toHaveBeenCalledWith(
      fakeExtractedData,
    );
  });

  it('should skip if parse returns empty string', async () => {
    const key = 'broken.pdf';
    mockParsePdfUseCase.execute.mockResolvedValue('');

    await useCase.execute({ key });

    expect(mockParsePdfUseCase.execute).toHaveBeenCalledWith({ pdfKey: key });
    expect(mockExtractInvoiceDataUseCase.execute).not.toHaveBeenCalled();
    expect(mockSaveInvoiceUseCase.execute).not.toHaveBeenCalled();
  });

  it('should call execute from job processor', async () => {
    const key = 'queued.pdf';
    const job = { data: { key } } as Job;
    const executeSpy = jest.spyOn(useCase, 'execute').mockResolvedValue();

    await useCase.process(job);

    expect(executeSpy).toHaveBeenCalledWith({ key });
  });
});
