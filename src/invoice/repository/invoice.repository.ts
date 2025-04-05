import { Invoice } from '../entities/invoice.entity';

export interface InvoiceRepository {
  save(invoice: Omit<Invoice, 'id'>): Promise<Invoice>;
}
