"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_resolver_1 = require("./booking.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entity/booking.entity");
const user_entity_1 = require("../user/entity/user.entity");
const place_entity_1 = require("../place/entity/place.entity");
const team_entity_1 = require("../team/entity/team.entity");
let BookingModule = class BookingModule {
};
BookingModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, user_entity_1.User, place_entity_1.Place, team_entity_1.Team])],
        providers: [booking_service_1.BookingService, booking_resolver_1.BookingResolver],
    })
], BookingModule);
exports.BookingModule = BookingModule;
//# sourceMappingURL=booking.module.js.map