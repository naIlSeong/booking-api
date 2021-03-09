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
exports.Team = void 0;
const graphql_1 = require("@nestjs/graphql");
const booking_entity_1 = require("../../booking/entity/booking.entity");
const common_entity_1 = require("../../common/entity/common.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const typeorm_1 = require("typeorm");
let Team = class Team extends common_entity_1.CoreEntity {
};
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Team.prototype, "teamName", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Team.prototype, "teamNameSlug", void 0);
__decorate([
    graphql_1.Field((type) => [user_entity_1.User]),
    typeorm_1.OneToMany((type) => user_entity_1.User, (user) => user.team),
    __metadata("design:type", Array)
], Team.prototype, "members", void 0);
__decorate([
    graphql_1.Field((type) => [booking_entity_1.Booking], { nullable: true }),
    typeorm_1.OneToMany((type) => booking_entity_1.Booking, (booking) => booking.team, { nullable: true }),
    __metadata("design:type", Array)
], Team.prototype, "bookings", void 0);
Team = __decorate([
    graphql_1.InputType('TeamInputType', { isAbstract: true }),
    graphql_1.ObjectType(),
    typeorm_1.Entity()
], Team);
exports.Team = Team;
//# sourceMappingURL=team.entity.js.map