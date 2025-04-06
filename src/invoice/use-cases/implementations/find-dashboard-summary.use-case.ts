import {
  FindDashboardSummaryRequest,
  FindDashboardSummaryResponse,
  FindDashboardSummaryUseCase,
} from '../find-dashboard-summary.use-case';
import { InvoiceRepository } from 'src/invoice/repository/invoice.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindDashboardSummaryUseCaseImpl
  implements FindDashboardSummaryUseCase
{
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(
    request: FindDashboardSummaryRequest,
  ): Promise<FindDashboardSummaryResponse> {
    return await this.invoiceRepository.getDashboardSummary(request);
  }
}
