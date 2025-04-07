import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'd03241b9-9d8c-4e06-a836-426b1ff700f0',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  title: string;

  @ApiProperty({
    example: 50,
    description: 'Product price',
    default: 0,
  })
  @Column({ type: 'float', default: 0 })
  price: number;

  @ApiProperty({
    example: 'Eu officia officia qui commodo deserunt culpa adipisicing.',
    description: 'Product description',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - For SEO',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty({
    example: ['t-shirt', 'woman'],
    description: 'Product tags',
    default: [],
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(`'`, '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(`'`, '');
  }
}
