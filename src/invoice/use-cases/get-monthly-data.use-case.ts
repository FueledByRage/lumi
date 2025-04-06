export interface GetMonthlyDataUseCaseRequest {
  customerId: number;
  year: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface GetMonthlyDataUseCaseResponse {
  consumption: MonthlyData[];
  compensation: MonthlyData[];
}

export interface GetMonthlyDataUseCase {
  execute(
    request: GetMonthlyDataUseCaseRequest,
  ): Promise<GetMonthlyDataUseCaseResponse>;
}
