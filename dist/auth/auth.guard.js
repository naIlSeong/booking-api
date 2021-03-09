"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const jwt_service_1 = require("../jwt/jwt.service");
const user_entity_1 = require("../user/entity/user.entity");
const user_service_1 = require("../user/user.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, userService, reflector) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const gqlContext = graphql_1.GqlExecutionContext.create(context).getContext();
        const token = gqlContext.token;
        const verified = this.jwtService.verify(token.toString());
        const userId = verified['id'];
        if (userId) {
            const { user, ok } = await this.userService.getUser({ userId });
            if (!user && ok === false) {
                return false;
            }
            if (user && ok === true) {
                gqlContext['user'] = user;
                if (roles.includes('Any')) {
                    return true;
                }
                if ((user.role === user_entity_1.UserRole.Individual ||
                    user.role === user_entity_1.UserRole.Representative ||
                    user.role === user_entity_1.UserRole.Member) &&
                    roles.includes('User')) {
                    return true;
                }
                return roles.includes(user.role);
            }
        }
        return true;
    }
};
AuthGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [jwt_service_1.JwtService,
        user_service_1.UserService,
        core_1.Reflector])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map