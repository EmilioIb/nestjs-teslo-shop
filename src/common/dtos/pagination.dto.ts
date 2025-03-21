import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
