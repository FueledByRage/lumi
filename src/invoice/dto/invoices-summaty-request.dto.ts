import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class DashboardSummaryRequestDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  customerId: number;

  @IsOptional()
  @IsString()
  year: string;

  @IsOptional()
  @IsString()
  month?: string;
}
