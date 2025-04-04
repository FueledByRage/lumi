import { ParsePdfUseCase } from 'src/pdf-parser/use-cases/parse-pdf.use-case';
import {
  ReadInvoiceFileRequest,
  ReadInvoiceFileUseCase,
} from '../read-invoice.use-case';
import { SaveInvoiceUseCase } from '../save-invoice.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ExtractInvoiceDataUseCase } from '../extract-invoice-info.use-case';

interface InvoiceJob {
  key: string;
}

@Injectable()
@Processor('invoice')
export class ReadInvoiceFileUseCaseImplementation
  extends WorkerHost
  implements ReadInvoiceFileUseCase
{
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
    const pdfData = (await this.parseInvoiceUseCase.execute({
      pdfKey: key,
    })) as string;

    const invoiceData = this.extractInvoiceDataUseCase.execute(pdfData);

    await this.saveInvoiceUseCase.execute({
      ...invoiceData,
    });
  }
}
