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
exports.Place = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_entity_1 = require("../../common/entity/common.entity");
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("../../booking/entity/booking.entity");
const location_entity_1 = require("./location.entity");
let Place = class Place extends common_entity_1.CoreEntity {
};
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Place.prototype, "placeName", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Place.prototype, "placeNameSlug", void 0);
__decorate([
    graphql_1.Field((type) => location_entity_1.PlaceLocation),
    typeorm_1.ManyToOne((type) => location_entity_1.PlaceLocation, (placeLocation) => placeLocation.places, {
        eager: true,
    }),
    __metadata("design:type", location_entity_1.PlaceLocation)
], Place.prototype, "placeLocation", void 0);
__decorate([
    graphql_1.Field((type) => [booking_entity_1.Booking], { nullable: true }),
    typeorm_1.OneToMany((type) => booking_entity_1.Booking, (booking) => booking.place, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Place.prototype, "bookings", void 0);
__decorate([
    graphql_1.Field((type) => Boolean),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Place.prototype, "inUse", void 0);
__decorate([
    graphql_1.Field((type) => Boolean),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Place.prototype, "isAvailable", void 0);
Place = __decorate([
    graphql_1.InputType('PlaceInputType', { isAbstract: true }),
    graphql_1.ObjectType(),
    typeorm_1.Entity()
], Place);
exports.Place = Place;
//# sourceMappingURL=place.entity.js.map