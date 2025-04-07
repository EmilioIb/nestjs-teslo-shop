import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1,
    example: 'T-Shirt',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description: 'Product price',
    minimum: 1,
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'T-shirt for women',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product slug for SEO (unique)',
    example: 't_shirt',
    uniqueItems: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product stock',
    minimum: 1,
    example: 10,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product sizes (array)',
    example: ['S', 'M', 'L'],
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    example: 'men',
  })
  @IsIn(['men', 'woman', 'kid', 'unisex'])
  gender: string;

  @ApiPropertyOptional({
    description: 'Product tags',
    example: ['men', 't-shirt', 'summer'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional({
    description: 'Product images',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
