export type EnergyInfo = {
  quantity: number;
  value: number;
};

export type ExtractedInvoiceData = {
  registrationNumber: string;
  customerName: string;
  date: string;
  referenceMonth: string;
  referenceYear: string;
  distributor: string;
  electricityConsumptionKWh: number;
  electricityCost: number;
  sceeeEnergyWithICMSKWh: number;
  sceeeEnergyWithICMSCost: number;
  compensatedEnergyKWh: number;
  compensatedEnergyCost: number;
  publicLightingContributionKWh: number;
  totalConsumption: number;
  totalValueWithoutGD: number;
  gdSavings: number;
};

export interface ExtractInvoiceDataUseCase {
  execute(text: string): ExtractedInvoiceData;
}
