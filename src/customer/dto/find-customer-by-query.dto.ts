import {
  IsOptional,
  IsInt,
  IsString,
  Min,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterEnum } from '../use-cases/find-customers-by-query.use-case';

export class FindCustomersByQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @Type(() => String)
  @IsInt()
  year: string;

  @IsOptional()
  @IsString()
  distributor?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  query?: string;

  @IsNotEmpty()
  @IsEnum(FilterEnum)
  type: FilterEnum;
}
