export interface DashboardSummaryRequest {
  customerId: number;
  year: string;
  month?: string;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface GetMonthlyDataUseCaseResponse {
  consumption: MonthlyData[];
  compensation: MonthlyData[];
}

export interface DashboardInvoiceSummary {
  totalEnergy: number;
  totalValue: number;
  averageCostPerKWh: number;
  invoiceCount: number;
  compensatedValue: number;
}
