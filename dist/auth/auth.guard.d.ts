import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly userService;
    private readonly reflector;
    constructor(jwtService: JwtService, userService: UserService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
