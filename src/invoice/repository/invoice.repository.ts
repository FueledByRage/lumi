import { Invoice } from '../entities/invoice.entity';
import {
  DashboardInvoiceSummary,
  DashboardSummaryRequest,
  GetMonthlyDataUseCaseResponse,
} from './invoice-repository.types';

export interface InvoiceRepository {
  save(invoice: Omit<Invoice, 'id'>): Promise<Invoice>;
  getDashboardSummary(
    query: DashboardSummaryRequest,
  ): Promise<DashboardInvoiceSummary>;
  getMonthlyData(
    customerId: number,
    year: number,
  ): Promise<GetMonthlyDataUseCaseResponse>;
}
