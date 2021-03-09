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
exports.ToggleIsAvialableOutput = exports.ToggleIsAvialableInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const place_entity_1 = require("../entity/place.entity");
let ToggleIsAvialableInput = class ToggleIsAvialableInput extends graphql_1.PickType(place_entity_1.Place, ['id']) {
};
ToggleIsAvialableInput = __decorate([
    graphql_1.InputType()
], ToggleIsAvialableInput);
exports.ToggleIsAvialableInput = ToggleIsAvialableInput;
let ToggleIsAvialableOutput = class ToggleIsAvialableOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], ToggleIsAvialableOutput.prototype, "isAvailable", void 0);
ToggleIsAvialableOutput = __decorate([
    graphql_1.ObjectType()
], ToggleIsAvialableOutput);
exports.ToggleIsAvialableOutput = ToggleIsAvialableOutput;
//# sourceMappingURL=toggle-IsAvailable.dto.js.map