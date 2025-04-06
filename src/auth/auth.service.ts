import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.UserRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.UserRepository.save(user);

      const { password: passwordDb, ...userInserted } = user;

      return { ...userInserted, token: this.getJwt({ id: user.id }) };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.UserRepository.findOne({
      where: {
        email,
      },
      select: { email: true, password: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Not valid credentials (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials (password)');

    return { ...user, token: this.getJwt({ id: user.id }) };
  }

  checkStatus(user: User) {
    const { id, email } = user;
    return { id, email, token: this.getJwt({ id: user.id }) };
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDbError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please checks server logs');
  }
}
