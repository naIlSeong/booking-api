import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    const verified = this.jwtService.verify(token.toString());
    const userId = verified['id'];
    if (userId) {
      const user = await this.userService.findById(userId);
      if (!user) {
        return false;
      }
      gqlContext['user'] = user;

      if (roles.includes('Any')) {
        return true;
      }
      return roles.includes(user.role);
    }

    return true;
  }
}
