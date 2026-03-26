import { UserModel } from '@generated/prisma/models';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { user: UserModel } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
