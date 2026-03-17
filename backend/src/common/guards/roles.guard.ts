import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@generated/prisma/enums';
import { UserModel } from '@generated/prisma/models';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      ctx.getHandler(),
    );
    if (!requiredRoles) return true;

    const { user }: { user: UserModel } = ctx.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
