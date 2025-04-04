import { CustomerWithInvoices } from 'src/customer/entities/customer.entity';
import { Repository } from 'typeorm';

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: number;
  name?: string;
  distributor?: string;
  customerNumber?: string;
}

export class CustomerRepositoryImpl extends Repository<CustomerWithInvoices> {
  async findByQuery(query: FindCustomersByQueryRequest) {
    const { page, pageSize, year, distributor, customerNumber } = query;

    const offset = (page - 1) * pageSize;

    const queryBuilder = this.createQueryBuilder('customer').where(
      'EXISTS (' +
        'SELECT 1 FROM invoices invoice ' +
        'WHERE invoice.customerId = customer.id ' +
        'AND invoice.referenceYear = :year' +
        ')',
      { year },
    );

    if (distributor) {
      queryBuilder.andWhere('customer.distributor = :distributor', {
        distributor,
      });
    }
    if (customerNumber) {
      queryBuilder.andWhere('customer.customerNumber = :customerNumber', {
        customerNumber,
      });
    }

    const total = await queryBuilder.getCount();

    const customers = await queryBuilder
      .orderBy('customer.id', 'ASC')
      .skip(offset)
      .take(pageSize)
      .getMany();

    const hasNextPage = offset + customers.length < total;
    const hasPreviousPage = page > 1;

    return { customers, total, hasNextPage, hasPreviousPage };
  }

  async findByNumberAndDistributor(
    customerNumber: string,
    distributor: string,
  ) {
    return this.findOne({
      where: { customerNumber, distributor },
    });
  }
}
