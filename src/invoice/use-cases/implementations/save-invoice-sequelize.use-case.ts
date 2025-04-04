import { InvoiceRepository } from 'src/invoice/repository/invoice.repository';
import {
  SaveInvoiceRequest,
  SaveInvoiceUseCase,
} from '../save-invoice.use-case';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Inject } from '@nestjs/common';
import { FindCustomerByNumberAndDistributorOrCreateUseCase } from 'src/customer/use-cases/find-by-number-and-distributor-or-create.use-case';

export class SaveInvoiceUseCaseImpl implements SaveInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
    @Inject('FindCustomerByNumberAndDistributorOrCreateUseCase')
    private readonly findCustomerByNumberAndDistributorOrCreateUseCase: FindCustomerByNumberAndDistributorOrCreateUseCase,
  ) {}

  async execute(request: SaveInvoiceRequest): Promise<Invoice> {
    const customer =
      await this.findCustomerByNumberAndDistributorOrCreateUseCase.execute({
        registrationNumber: request.registrationNumber,
        distributor: request.distributor,
      });

    return await this.invoiceRepository.save({
      ...request,
      customer,
    });
  }
}
