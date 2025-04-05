import { Inject, Injectable } from '@nestjs/common';
import { InvoiceModel } from 'src/invoice/entities/sequelize/invoice.model';
import { Repository } from 'typeorm';
import { InvoiceRepository } from '../invoice.repository';

@Injectable()
export class InvoiceRepositoryImpl implements InvoiceRepository {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async save(invoice: Omit<InvoiceModel, 'id'>) {
    const invoiceModel = this.invoiceRepository.create(invoice);
    return this.invoiceRepository.save(invoiceModel);
  }

  async findById(id: number) {
    return this.invoiceRepository.findOne({
      where: { id },
    });
  }
}
