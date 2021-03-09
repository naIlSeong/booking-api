import { UserRole } from 'src/user/entity/user.entity';
export declare type AllowedRoles = keyof typeof UserRole | 'Any' | 'User';
export declare const Role: (roles: AllowedRoles[]) => import("@nestjs/common").CustomDecorator<string>;
