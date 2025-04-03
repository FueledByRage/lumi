import { CustomerModel } from 'src/customer/entities/sequelize/customer';
import { Repository } from 'typeorm';

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: number;
  name?: string;
  distributor?: string;
  customerNumber?: string;
}

export class CustomerRepositoryImpl extends Repository<CustomerModel> {
  async findByQuery(query: FindCustomersByQueryRequest) {
    const { page, pageSize, year, name, distributor, customerNumber } = query;

    const offset = (page - 1) * pageSize;

    const queryBuilder = this.createQueryBuilder('customer')
      .innerJoin('customer.invoices', 'invoice')
      .where('EXTRACT(YEAR FROM invoice.referenceYear) = :year', { year });

    if (name) {
      queryBuilder.andWhere('customer.name ILIKE :name', { name: `%${name}%` });
    }
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
      .groupBy('customer.id')
      .orderBy('customer.name', 'ASC')
      .skip(offset)
      .take(pageSize)
      .getMany();

    const hasNextPage = offset + customers.length < total;
    const hasPreviousPage = page > 1;

    return { customers, total, hasNextPage, hasPreviousPage };
  }
}
