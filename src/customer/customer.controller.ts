import { Controller, Get, Inject, Query } from '@nestjs/common';
import { FindCustomersByQueryDto } from './dto/find-customer-by-query.dto';
import { FindCustomersByQueryUseCase } from './use-cases/find-customers-by-query.use-case';

@Controller('customers')
export class CustomerController {
  constructor(
    @Inject('FindCustomersByQueryUseCase')
    private readonly findCustomersByQueryUseCase: FindCustomersByQueryUseCase,
  ) {}

  @Get()
  async findByQuery(@Query() query: FindCustomersByQueryDto) {
    return this.findCustomersByQueryUseCase.execute(query);
  }
}
