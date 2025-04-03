import { Invoice } from 'src/invoice/entities/invoice.entity';

export interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  distributor: string;
  invoices: Invoice[];
}
