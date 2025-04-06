import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMonthlyDataRequest {
  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  year: number;
}
