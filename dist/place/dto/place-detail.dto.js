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
exports.PlaceDetailOutput = exports.PlaceDetailInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const place_entity_1 = require("../entity/place.entity");
let PlaceDetailInput = class PlaceDetailInput {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int),
    __metadata("design:type", Number)
], PlaceDetailInput.prototype, "placeId", void 0);
PlaceDetailInput = __decorate([
    graphql_1.InputType()
], PlaceDetailInput);
exports.PlaceDetailInput = PlaceDetailInput;
let PlaceDetailOutput = class PlaceDetailOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => place_entity_1.Place, { nullable: true }),
    __metadata("design:type", place_entity_1.Place)
], PlaceDetailOutput.prototype, "place", void 0);
PlaceDetailOutput = __decorate([
    graphql_1.ObjectType()
], PlaceDetailOutput);
exports.PlaceDetailOutput = PlaceDetailOutput;
//# sourceMappingURL=place-detail.dto.js.map