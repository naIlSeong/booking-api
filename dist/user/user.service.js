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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entity/user.entity");
const jwt_service_1 = require("../jwt/jwt.service");
let UserService = class UserService {
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    generateSlug(username) {
        return username.trim().toLowerCase().replace(/ /g, '-');
    }
    async createUser({ studentId, username, password, }) {
        try {
            const usernameSlug = this.generateSlug(username);
            const existUsername = await this.userRepo.findOne({ username });
            const existUsernameSlug = await this.userRepo.findOne({ usernameSlug });
            if (existUsername || existUsernameSlug) {
                return {
                    ok: false,
                    error: 'Already exist username',
                };
            }
            if (studentId) {
                const existStudentId = await this.userRepo.findOne({ studentId });
                if (existStudentId) {
                    return {
                        ok: false,
                        error: 'Already exist studentID',
                    };
                }
            }
            await this.userRepo.save(this.userRepo.create({ username, usernameSlug, password, studentId }));
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async createAdmin({ username, password, }) {
        try {
            const existAdmin = await this.userRepo.findOne({ role: user_entity_1.UserRole.Admin });
            if (existAdmin) {
                return {
                    ok: false,
                    error: 'Already exist admin',
                };
            }
            const existUsername = await this.userRepo.findOne({ username });
            if (existUsername) {
                return {
                    ok: false,
                    error: 'Already exist username',
                };
            }
            await this.userRepo.save(this.userRepo.create({
                username,
                usernameSlug: this.generateSlug(username),
                password,
                role: user_entity_1.UserRole.Admin,
            }));
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async login({ username, password }) {
        try {
            const user = await this.userRepo.findOne({ username });
            if (!user) {
                return {
                    ok: false,
                    error: 'User not found',
                };
            }
            const isMatch = await user.checkPassword(password);
            if (!isMatch) {
                return {
                    ok: false,
                    error: 'Wrong password',
                };
            }
            return {
                ok: true,
                token: this.jwtService.sign(user.id),
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async deleteUser(userId) {
        try {
            await this.userRepo.delete({ id: userId });
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async editUser({ username, password, studentId }, userId) {
        try {
            const user = await this.userRepo.findOne({ id: userId });
            if (username) {
                const usernameSlug = this.generateSlug(username);
                const exist = await this.userRepo.findOne({ username });
                const existSlug = await this.userRepo.findOne({ usernameSlug });
                if ((exist && exist.username !== user.username) ||
                    (existSlug && existSlug.usernameSlug !== user.usernameSlug)) {
                    return {
                        ok: false,
                        error: 'Already username exist',
                    };
                }
                user.username = username;
                user.usernameSlug = usernameSlug;
            }
            if (password) {
                const isMatch = await user.checkPassword(password);
                if (isMatch) {
                    return {
                        ok: false,
                        error: 'Same Password',
                    };
                }
                user.password = password;
            }
            if (studentId && studentId !== user.studentId) {
                const exist = await this.userRepo.findOne({ studentId });
                if (exist) {
                    return {
                        ok: false,
                        error: 'Already exist student id',
                    };
                }
                user.studentId = studentId;
            }
            await this.userRepo.save(user);
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async getUser({ userId }) {
        try {
            const user = await this.userRepo.findOne({ id: userId });
            if (!user) {
                return {
                    ok: false,
                    error: 'User not found',
                };
            }
            return {
                ok: true,
                user,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async searchUser({ query }) {
        try {
            const querySlug = this.generateSlug(query);
            const users = await this.userRepo.find({
                where: {
                    usernameSlug: typeorm_2.Raw((usernameSlug) => `${usernameSlug} ILIKE '%${querySlug}%'`),
                },
            });
            if (!users) {
                return {
                    ok: false,
                    error: 'User not found',
                };
            }
            return {
                ok: true,
                users,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_service_1.JwtService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map