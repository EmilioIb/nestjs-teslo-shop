import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({
    example: 'd03241b9-9d8c-4e06-a836-426b1ff700f0',
    description: 'Image ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'image1.jpg',
    description: 'Image name',
    uniqueItems: true,
  })
  @Column({ type: 'text' })
  url: string;

  @ApiProperty({
    example: 'e6f8b899-a8da-4e78-b2c8-b6646902e4d0',
    description: 'Product ID',
  })
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
