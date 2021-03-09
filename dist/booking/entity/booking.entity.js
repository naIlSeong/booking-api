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
exports.Booking = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const common_entity_1 = require("../../common/entity/common.entity");
const team_entity_1 = require("../../team/entity/team.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const typeorm_1 = require("typeorm");
const place_entity_1 = require("../../place/entity/place.entity");
let Booking = class Booking extends common_entity_1.CoreEntity {
    checkDate() {
        try {
            if (this.startAt && this.endAt) {
                if (this.startAt >= this.endAt) {
                    throw Error();
                }
                if (Date.parse(this.endAt.toString()) -
                    Date.parse(this.startAt.toString()) <
                    1800000) {
                    throw Error('Invalid Date');
                }
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
};
__decorate([
    graphql_1.Field((type) => place_entity_1.Place),
    typeorm_1.ManyToOne((type) => place_entity_1.Place, (place) => place.bookings),
    __metadata("design:type", place_entity_1.Place)
], Booking.prototype, "place", void 0);
__decorate([
    graphql_1.Field((type) => team_entity_1.Team, { nullable: true }),
    typeorm_1.ManyToOne((type) => team_entity_1.Team, (team) => team.bookings, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", team_entity_1.Team)
], Booking.prototype, "team", void 0);
__decorate([
    graphql_1.Field((type) => user_entity_1.User),
    typeorm_1.ManyToOne((type) => user_entity_1.User, (user) => user.CreatedBooking, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "creator", void 0);
__decorate([
    typeorm_1.RelationId((booking) => booking.creator),
    __metadata("design:type", Number)
], Booking.prototype, "creatorId", void 0);
__decorate([
    graphql_1.Field((type) => Date),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Booking.prototype, "startAt", void 0);
__decorate([
    graphql_1.Field((type) => Date),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Booking.prototype, "endAt", void 0);
__decorate([
    graphql_1.Field((type) => Boolean),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "inUse", void 0);
__decorate([
    graphql_1.Field((type) => Boolean),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "isFinished", void 0);
__decorate([
    graphql_1.Field((type) => Boolean),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "canExtend", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Booking.prototype, "checkDate", null);
Booking = __decorate([
    graphql_1.InputType('BookingInputType', { isAbstract: true }),
    graphql_1.ObjectType(),
    typeorm_1.Entity()
], Booking);
exports.Booking = Booking;
//# sourceMappingURL=booking.entity.js.map