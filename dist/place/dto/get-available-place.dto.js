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
exports.GetAvailablePlaceOutput = exports.GetAvailablePlaceInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const place_entity_1 = require("../entity/place.entity");
let GetAvailablePlaceInput = class GetAvailablePlaceInput {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int),
    __metadata("design:type", Number)
], GetAvailablePlaceInput.prototype, "locationId", void 0);
GetAvailablePlaceInput = __decorate([
    graphql_1.InputType()
], GetAvailablePlaceInput);
exports.GetAvailablePlaceInput = GetAvailablePlaceInput;
let GetAvailablePlaceOutput = class GetAvailablePlaceOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => [place_entity_1.Place], { nullable: true }),
    __metadata("design:type", Array)
], GetAvailablePlaceOutput.prototype, "places", void 0);
GetAvailablePlaceOutput = __decorate([
    graphql_1.ObjectType()
], GetAvailablePlaceOutput);
exports.GetAvailablePlaceOutput = GetAvailablePlaceOutput;
//# sourceMappingURL=get-available-place.dto.js.map