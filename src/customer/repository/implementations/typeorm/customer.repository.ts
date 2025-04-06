import { CustomerModel } from 'src/customer/entities/typeorm/customer';
import { Repository } from 'typeorm';
import { CustomerRepository } from '../../customer.repository';
import { Inject, Injectable } from '@nestjs/common';
import {
  FilterEnum,
  FindCustomersByQueryRequest,
} from '../../customer-repository.types';

@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(
    @Inject('CustomerRepositoryTypeOrm')
    private readonly customerRepository: Repository<CustomerModel>,
  ) {}

  async save(customer: Omit<CustomerModel, 'id'>) {
    const customerModel = this.customerRepository.create(customer);
    return this.customerRepository.save(customerModel);
  }

  async findByQuery(request: FindCustomersByQueryRequest) {
    const { page, pageSize, year, query, type } = request;
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

    if (query) {
      const filter = this.buildQuery(type);

      queryBuilder.andWhere(filter, {
        queryPattern: `%${query}%`,
      });
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

  private buildQuery(filterType: FilterEnum) {
    const queries = {
      [FilterEnum.CONSUMERS]: [
        'LOWER(customer.name) LIKE LOWER(:queryPattern)',
        'customer.registrationNumber LIKE :queryPattern',
      ],
      [FilterEnum.DISTRIBUTORS]: [
        'LOWER(customer.distributor) LIKE LOWER(:queryPattern)',
      ],
    };

    return queries[filterType].map((q) => `(${q})`).join(' OR ');
  }
}
