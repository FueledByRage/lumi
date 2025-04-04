import { IsOptional, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
}
