"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocationOutput = exports.CreateLocationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const location_entity_1 = require("../entity/location.entity");
let CreateLocationInput = class CreateLocationInput extends graphql_1.PickType(location_entity_1.PlaceLocation, [
    'locationName',
]) {
};
CreateLocationInput = __decorate([
    graphql_1.InputType()
], CreateLocationInput);
exports.CreateLocationInput = CreateLocationInput;
let CreateLocationOutput = class CreateLocationOutput extends common_dto_1.CoreOutput {
};
CreateLocationOutput = __decorate([
    graphql_1.ObjectType()
], CreateLocationOutput);
exports.CreateLocationOutput = CreateLocationOutput;
//# sourceMappingURL=create-loaction.dto.js.map