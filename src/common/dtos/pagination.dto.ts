import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of rows required',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    required: false,
    default: 0,
    description: 'Number of rows to skip',
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
