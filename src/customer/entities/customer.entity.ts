import { Invoice } from 'src/invoice/entities/invoice.entity';

export interface Customer {
  id: number;
  registrationNumber: string;
  distributor: string;
}

export interface CustomerWithInvoices extends Customer {
  invoices: Invoice[];
}
