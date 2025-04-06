import { Injectable } from '@nestjs/common';
import {
  HandleInvoiceUploadRequest,
  HandleInvoiceUploadUseCase,
} from '../handle-invoice-upload.use-case';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Queues } from 'src/shared/types/queues.types';

@Injectable()
export class HandleInvoiceUploadUseCaseImpl
  implements HandleInvoiceUploadUseCase
{
  constructor(
    @InjectQueue(Queues.INVOICE) private readonly invoiceQueue: Queue,
  ) {}

  async execute({ key }: HandleInvoiceUploadRequest): Promise<void> {
    await this.invoiceQueue.add('read-invoice', { key });
  }
}
