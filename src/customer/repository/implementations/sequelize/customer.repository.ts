import { CustomerModel } from 'src/customer/entities/sequelize/customer';
import { Repository } from 'typeorm';

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: number;
  name?: string;
  distributor?: string;
  registrationNumber?: string;
}

export class CustomerRepositoryImpl extends Repository<CustomerModel> {
  async findByQuery(query: FindCustomersByQueryRequest) {
    const { page, pageSize, year, distributor, registrationNumber } = query;

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
    if (registrationNumber) {
      queryBuilder.andWhere(
        'customer.registrationNumber = :registrationNumber',
        {
          registrationNumber,
        },
      );
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
    registrationNumber: string,
    distributor: string,
  ) {
    return this.findOne({
      where: { registrationNumber, distributor },
    });
  }
}
