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
exports.CreatePlaceOutput = exports.CreatePlaceInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const place_entity_1 = require("../entity/place.entity");
let CreatePlaceInput = class CreatePlaceInput extends graphql_1.PickType(place_entity_1.Place, ['placeName']) {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int),
    __metadata("design:type", Number)
], CreatePlaceInput.prototype, "locationId", void 0);
CreatePlaceInput = __decorate([
    graphql_1.InputType()
], CreatePlaceInput);
exports.CreatePlaceInput = CreatePlaceInput;
let CreatePlaceOutput = class CreatePlaceOutput extends common_dto_1.CoreOutput {
};
CreatePlaceOutput = __decorate([
    graphql_1.ObjectType()
], CreatePlaceOutput);
exports.CreatePlaceOutput = CreatePlaceOutput;
//# sourceMappingURL=create-place.dto.js.map