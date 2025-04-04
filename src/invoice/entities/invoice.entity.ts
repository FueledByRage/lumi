import { Customer } from 'src/customer/entities/customer.entity';

export interface Invoice {
  id: number;
  referenceMonth: string;
  referenceYear: string;
  electricityConsumptionKWh: number;
  electricityCost: number;
  sceeeEnergyWithICMSKWh: number;
  sceeeEnergyWithICMSCost: number;
  compensatedEnergyKWh: number;
  compensatedEnergyCost: number;
  publicLightingContributionKWh: number;
  customer: Customer;
}
