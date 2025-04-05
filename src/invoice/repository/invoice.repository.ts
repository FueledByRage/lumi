import { DashboardInvoiceSummary } from '../dto/invoices-summary.dto';
import { Invoice } from '../entities/invoice.entity';

export interface DashboardSummaryRequest {
  customerId: number;
  year?: string;
  month?: string;
}

export interface InvoiceRepository {
  save(invoice: Omit<Invoice, 'id'>): Promise<Invoice>;
  getDashboardSummary(
    query: DashboardSummaryRequest,
  ): Promise<DashboardInvoiceSummary>;
}
