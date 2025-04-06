import { ParsePdfUseCase } from 'src/pdf-parser/use-cases/parse-pdf.use-case';
import {
  ReadInvoiceFileRequest,
  ReadInvoiceFileUseCase,
} from '../read-invoice.use-case';
import { SaveInvoiceUseCase } from '../save-invoice.use-case';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ExtractInvoiceDataUseCase } from '../extract-invoice-info.use-case';
import { Queues } from '../../../shared/types/queues.types';

interface InvoiceJob {
  key: string;
}

@Injectable()
@Processor(Queues.INVOICE)
export class ReadInvoiceFileUseCaseImplementation
  extends WorkerHost
  implements ReadInvoiceFileUseCase
{
  private readonly logger = new Logger();
  constructor(
    @Inject('ParsePdfUseCase')
    private readonly parseInvoiceUseCase: ParsePdfUseCase,
    @Inject('SaveInvoiceUseCase')
    private readonly saveInvoiceUseCase: SaveInvoiceUseCase,
    @Inject('ExtractInvoiceDataUseCase')
    private readonly extractInvoiceDataUseCase: ExtractInvoiceDataUseCase,
  ) {
    super();
  }

  async process(job: Job<InvoiceJob>) {
    const { key } = job.data;
    await this.execute({ key });
  }

  async execute({ key }: ReadInvoiceFileRequest): Promise<void> {
    const pdfData = await this.parseInvoiceUseCase.execute({
      pdfKey: key,
    });

    if (pdfData === '') {
      this.logger.warn('Error parsing PDF data');

      return;
    }

    const invoiceData = this.extractInvoiceDataUseCase.execute(pdfData);

    await this.saveInvoiceUseCase.execute({
      ...invoiceData,
    });
  }
}
