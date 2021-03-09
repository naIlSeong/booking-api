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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_decorator_1 = require("../auth/auth.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const delete_user_dto_1 = require("./dto/delete-user.dto");
const edit_user_dto_1 = require("./dto/edit-user.dto");
const get_user_dto_1 = require("./dto/get-user.dto");
const login_dto_1 = require("./dto/login.dto");
const search_user_dto_1 = require("./dto/search-user.dto");
const user_entity_1 = require("./entity/user.entity");
const user_service_1 = require("./user.service");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    me(user) {
        return user;
    }
    createUser(createUserInput) {
        return this.userService.createUser(createUserInput);
    }
    createAdmin(createUserInput) {
        return this.userService.createAdmin(createUserInput);
    }
    login(loginInput) {
        return this.userService.login(loginInput);
    }
    deleteUser(user) {
        return this.userService.deleteUser(user.id);
    }
    editUser(editUserInput, user) {
        return this.userService.editUser(editUserInput, user.id);
    }
    getUser(getUserInput) {
        return this.userService.getUser(getUserInput);
    }
    searchUser(searchUserInput) {
        return this.userService.searchUser(searchUserInput);
    }
};
__decorate([
    graphql_1.Query((returns) => user_entity_1.User),
    role_decorator_1.Role(['Any']),
    __param(0, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    graphql_1.Mutation((returns) => create_user_dto_1.CreateUserOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    graphql_1.Mutation((retruns) => create_user_dto_1.CreateUserOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createAdmin", null);
__decorate([
    graphql_1.Mutation((returns) => login_dto_1.LoginOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    graphql_1.Mutation((returns) => delete_user_dto_1.DeleteUserOutput),
    role_decorator_1.Role(['User']),
    __param(0, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    graphql_1.Mutation((returns) => edit_user_dto_1.EditUserOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_user_dto_1.EditUserInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "editUser", null);
__decorate([
    graphql_1.Query((returns) => get_user_dto_1.GetUserOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_dto_1.GetUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    graphql_1.Query((returns) => search_user_dto_1.SearchUserOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_user_dto_1.SearchUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "searchUser", null);
UserResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map