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
  registrationNumber: string;
  distributor: string;
  customerName: string;
}

export interface SaveInvoiceUseCase {
  execute(request: SaveInvoiceRequest): Promise<Invoice>;
}
