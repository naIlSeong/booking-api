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
exports.User = exports.UserRole = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../../common/entity/common.entity");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const booking_entity_1 = require("../../booking/entity/booking.entity");
const team_entity_1 = require("../../team/entity/team.entity");
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "Admin";
    UserRole["Individual"] = "Individual";
    UserRole["Representative"] = "Representative";
    UserRole["Member"] = "Member";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
graphql_1.registerEnumType(UserRole, {
    name: 'UserRole',
});
let User = class User extends common_entity_1.CoreEntity {
    writeEmail() {
        try {
            if (this.studentId) {
                this.studentEmail = `${this.studentId}@jnu.ac.kr`;
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
    async hashPassword() {
        try {
            if (this.password) {
                this.password = await bcrypt.hash(this.password, +process.env.SALT);
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
    async checkPassword(password) {
        try {
            return bcrypt.compare(password, this.password);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int, { nullable: true }),
    typeorm_1.Column({ nullable: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], User.prototype, "studentId", void 0);
__decorate([
    graphql_1.Field((type) => String, { nullable: true }),
    typeorm_1.Column({ nullable: true }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "studentEmail", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], User.prototype, "usernameSlug", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    class_validator_1.IsString(),
    class_validator_1.Length(8),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    graphql_1.Field((type) => UserRole),
    typeorm_1.Column({ type: 'enum', enum: UserRole, default: UserRole.Individual }),
    class_validator_1.IsEnum(UserRole),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    graphql_1.Field((type) => [booking_entity_1.Booking], { nullable: true }),
    typeorm_1.ManyToMany((type) => booking_entity_1.Booking, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "bookings", void 0);
__decorate([
    graphql_1.Field((type) => [booking_entity_1.Booking], { nullable: true }),
    typeorm_1.OneToMany((type) => booking_entity_1.Booking, (booking) => booking.creator, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "CreatedBooking", void 0);
__decorate([
    graphql_1.Field((type) => team_entity_1.Team, { nullable: true }),
    typeorm_1.ManyToOne((type) => team_entity_1.Team, (team) => team.members, {
        nullable: true,
        onDelete: 'SET NULL',
        eager: true,
    }),
    __metadata("design:type", team_entity_1.Team)
], User.prototype, "team", void 0);
__decorate([
    typeorm_1.RelationId((user) => user.team),
    __metadata("design:type", Number)
], User.prototype, "teamId", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "writeEmail", null);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    graphql_1.InputType('UserInputType', { isAbstract: true }),
    graphql_1.ObjectType(),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map