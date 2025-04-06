import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { Queues } from '../../../../shared/types/queues.types';
import { HandleInvoiceUploadUseCaseImpl } from '../handle-invoice-upload.use-case';

describe('HandleInvoiceUploadUseCaseImpl', () => {
  let useCase: HandleInvoiceUploadUseCaseImpl;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleInvoiceUploadUseCaseImpl,
        {
          provide: getQueueToken(Queues.INVOICE),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(HandleInvoiceUploadUseCaseImpl);
    mockQueue = module.get(getQueueToken(Queues.INVOICE));
  });

  it('should add a job to the invoice queue with the provided key', async () => {
    const key = 'uploads/invoice-123.pdf';

    await useCase.execute({ key, url: 'http://example.com/invoice-123.pdf' });

    expect(mockQueue.add).toHaveBeenCalledWith('read-invoice', { key });
  });
});
