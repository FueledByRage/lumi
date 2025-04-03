import { InvoiceRepository } from 'src/invoice/repository/invoice.repository';
import {
  SaveInvoiceRequest,
  SaveInvoiceUseCase,
} from '../save-invoice.use-case';
import { Invoice } from 'src/invoice/entities/invoice.entity';

export class SaveInvoiceUseCaseImpl implements SaveInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(request: SaveInvoiceRequest): Promise<Invoice> {
    return await this.invoiceRepository.save(request);
  }
}
