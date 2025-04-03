import { ParsePdfUseCase } from 'src/pdf-parser/use-cases/parse-pdf.use-case';
import {
  ReadInvoiceFileRequest,
  ReadInvoiceFileUseCase,
} from '../read-invoice.use-case';
import { SaveInvoiceUseCase } from '../save-invoice.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface InvoiceJob {
  fileKey: string;
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
  ) {
    super();
  }

  async process(job: Job<InvoiceJob>) {
    const { fileKey } = job.data;

    await this.execute({ fileUrl: fileKey });
  }

  async execute({ fileUrl }: ReadInvoiceFileRequest): Promise<void> {
    const pdfData = await this.parseInvoiceUseCase.execute({ pdfUrl: fileUrl });

    console.log(pdfData);
  }
}
