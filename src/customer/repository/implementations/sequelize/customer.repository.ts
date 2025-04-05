import { CustomerModel } from 'src/customer/entities/sequelize/customer';
import { Repository } from 'typeorm';
import { CustomerRepository } from '../../customer.repository';
import { Inject, Injectable } from '@nestjs/common';

export interface FindCustomersByQueryRequest {
  page: number;
  pageSize: number;
  year: string;
  name?: string;
  distributor?: string;
  registrationNumber?: string;
}

@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: Repository<CustomerModel>,
  ) {}

  async save(customer: Omit<CustomerModel, 'id'>) {
    const customerModel = this.customerRepository.create(customer);
    return this.customerRepository.save(customerModel);
  }

  async findByQuery(query: FindCustomersByQueryRequest) {
    const { page, pageSize, year, distributor, registrationNumber } = query;

    const offset = (page - 1) * pageSize;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect(
        'customer.invoices',
        'invoice',
        'invoice.referenceYear = :year',
        { year },
      )
      .where(
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

    const totalElements = await queryBuilder.getCount();

    const content = await queryBuilder
      .orderBy('customer.id', 'ASC')
      .skip(offset)
      .take(pageSize)
      .getMany();

    const hasNext = offset + content.length < totalElements;
    const hasPrevious = page > 1;

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      content,
      page,
      pageSize,
      totalElements,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async findByNumberAndDistributor(
    registrationNumber: string,
    distributor: string,
  ) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { registrationNumber, distributor },
      });

      if (!customer) {
        return null;
      }

      return customer;
    } catch (error) {
      console.error('Error finding customer:', error);
      return null;
    }
  }
}
