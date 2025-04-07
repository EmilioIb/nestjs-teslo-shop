import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: 'd03241b9-9d8c-4e06-a836-426b1ff700f0',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test3@google.com',
    description: 'User email',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @ApiProperty({
    example: '$2b$10$OLehhujEJJevt.TzBme7Aee61g8lgb0PjhARHvAZNVUdASD7zXQkC',
    description: 'User password (encrypted)',
  })
  @Column({ type: 'text', select: false })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User fullName',
  })
  @Column({ type: 'text' })
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'Boolean that indicates status of user',
  })
  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['admin'],
    description: 'User role',
  })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
