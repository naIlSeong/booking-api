import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const verified = this.jwtService.verify(token.toString());
        const userId = verified['id'];
        if (userId) {
          const user = await this.userService.findById(userId);
          req['user'] = user;
        }
      } catch (error) {}
    }
    next();
  }
}
