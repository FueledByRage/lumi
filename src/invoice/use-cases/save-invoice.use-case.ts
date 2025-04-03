import { Customer } from 'src/customer/entities/customer.entity';
import { Invoice } from '../entities/invoice.entity';

export interface SaveInvoiceRequest {
  referenceMonth: string;
  referenceYear: string;
  electricityConsumptionKWh: number;
  electricityCost: number;
  sceeeEnergyWithICMSKWh: number;
  sceeeEnergyWithICMSCost: number;
  compensatedEnergyKWh: number;
  compensatedEnergyCost: number;
  publicLightingContributionKWh: number;
  customerId: number;
  url: string;
  customer: Customer;
}

export interface SaveInvoiceUseCase {
  execute(request: SaveInvoiceRequest): Promise<Invoice>;
}
