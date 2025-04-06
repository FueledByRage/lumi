export interface FindDashboardSummaryRequest {
  customerId: number;
  year: string;
  month?: string;
}

export interface FindDashboardSummaryResponse {
  totalEnergy: number;
  totalValue: number;
  averageCostPerKWh: number;
  invoiceCount: number;
  compensatedValue: number;
}

export interface FindDashboardSummaryUseCase {
  execute(
    request: FindDashboardSummaryRequest,
  ): Promise<FindDashboardSummaryResponse>;
}
