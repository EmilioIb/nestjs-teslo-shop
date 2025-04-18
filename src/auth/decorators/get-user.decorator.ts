import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    if (!data) return user;

    const userProperty = user[data];

    if (!userProperty)
      throw new InternalServerErrorException('User not found (property)');

    return userProperty;
  },
);
