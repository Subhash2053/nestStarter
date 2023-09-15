import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLE_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UsersService } from 'src/modules/users/users.service';
import { AccessContorlService } from 'src/shared/access-control.service';

export class TokenDto {
  id: number;
  role: Role;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessContorlService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    /* 
   if (!requiredRoles || requiredRoles.includes('all')) {
      return true;
    }
    */

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const userInfo = await this.userService.findOne({
      username: user.username,
    });

    for (const role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: userInfo.role,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
