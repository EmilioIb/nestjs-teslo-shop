import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'test3@google.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User pasword. (Must include uppercase, lowercase and number)',
    example: 'superPassword123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Jonh Doe',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
