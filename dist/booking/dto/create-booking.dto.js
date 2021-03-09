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
exports.CreateBookingOutput = exports.CreateBookingInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const booking_entity_1 = require("../entity/booking.entity");
let CreateBookingInput = class CreateBookingInput extends graphql_1.PickType(booking_entity_1.Booking, [
    'startAt',
    'endAt',
]) {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int),
    __metadata("design:type", Number)
], CreateBookingInput.prototype, "placeId", void 0);
__decorate([
    graphql_1.Field((type) => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], CreateBookingInput.prototype, "withTeam", void 0);
CreateBookingInput = __decorate([
    graphql_1.InputType()
], CreateBookingInput);
exports.CreateBookingInput = CreateBookingInput;
let CreateBookingOutput = class CreateBookingOutput extends common_dto_1.CoreOutput {
};
CreateBookingOutput = __decorate([
    graphql_1.ObjectType()
], CreateBookingOutput);
exports.CreateBookingOutput = CreateBookingOutput;
//# sourceMappingURL=create-booking.dto.js.map