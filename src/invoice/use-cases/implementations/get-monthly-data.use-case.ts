import { InvoiceRepository } from 'src/invoice/repository/invoice.repository';
import {
  GetMonthlyDataUseCase,
  GetMonthlyDataUseCaseRequest,
  GetMonthlyDataUseCaseResponse,
} from '../get-monthly-data.use-case';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export default class GetMonthlyDataUseCaseImpl
  implements GetMonthlyDataUseCase
{
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute({
    customerId,
    year,
  }: GetMonthlyDataUseCaseRequest): Promise<GetMonthlyDataUseCaseResponse> {
    return await this.invoiceRepository.getMonthlyData(customerId, year);
  }
}
