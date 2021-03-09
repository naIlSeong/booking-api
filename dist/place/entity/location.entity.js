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
exports.PlaceLocation = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_entity_1 = require("../../common/entity/common.entity");
const typeorm_1 = require("typeorm");
const place_entity_1 = require("./place.entity");
let PlaceLocation = class PlaceLocation extends common_entity_1.CoreEntity {
};
__decorate([
    graphql_1.Field((type) => [place_entity_1.Place], { nullable: true }),
    typeorm_1.OneToMany((type) => place_entity_1.Place, (place) => place.placeLocation, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], PlaceLocation.prototype, "places", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], PlaceLocation.prototype, "locationName", void 0);
__decorate([
    graphql_1.Field((type) => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], PlaceLocation.prototype, "locationNameSlug", void 0);
__decorate([
    graphql_1.Field((type) => Boolean),
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], PlaceLocation.prototype, "isAvailable", void 0);
PlaceLocation = __decorate([
    graphql_1.InputType('PlaceLocationInputType', { isAbstract: true }),
    graphql_1.ObjectType(),
    typeorm_1.Entity()
], PlaceLocation);
exports.PlaceLocation = PlaceLocation;
//# sourceMappingURL=location.entity.js.map