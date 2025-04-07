import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Head,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Checked status successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth()
  checkAuthStatus(
    @GetUser()
    user: User,
  ) {
    return this.authService.checkStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  testingPrivateRoute(
    @GetUser()
    user: User,
    @GetUser('email')
    email: string,
    @RawHeaders()
    rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      email,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiBearerAuth()
  privateRoute2(@GetUser() user: User) {
    return { ok: true, user };
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiBearerAuth()
  privateRoute3(@GetUser() user: User) {
    return { ok: true, user };
  }
}
