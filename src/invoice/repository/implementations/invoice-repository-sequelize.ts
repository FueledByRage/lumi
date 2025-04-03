import { InvoiceModel } from 'src/invoice/entities/sequelize/invoice.model';
import { Repository } from 'typeorm';

export class InvoiceRepositoryImpl extends Repository<InvoiceModel> {}
