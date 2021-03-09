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
exports.LocationDetailOutput = exports.LocationDetailInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const location_entity_1 = require("../entity/location.entity");
let LocationDetailInput = class LocationDetailInput {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int),
    __metadata("design:type", Number)
], LocationDetailInput.prototype, "locationId", void 0);
LocationDetailInput = __decorate([
    graphql_1.InputType()
], LocationDetailInput);
exports.LocationDetailInput = LocationDetailInput;
let LocationDetailOutput = class LocationDetailOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => location_entity_1.PlaceLocation, { nullable: true }),
    __metadata("design:type", location_entity_1.PlaceLocation)
], LocationDetailOutput.prototype, "location", void 0);
LocationDetailOutput = __decorate([
    graphql_1.ObjectType()
], LocationDetailOutput);
exports.LocationDetailOutput = LocationDetailOutput;
//# sourceMappingURL=location-detail.dto.js.map