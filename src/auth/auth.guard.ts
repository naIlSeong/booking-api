import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    }

    return true;
  }
}
