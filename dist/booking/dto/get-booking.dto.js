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
exports.GetBookingOutput = exports.GetBookingInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const booking_entity_1 = require("../entity/booking.entity");
let GetBookingInput = class GetBookingInput {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], GetBookingInput.prototype, "placeId", void 0);
__decorate([
    graphql_1.Field((type) => Boolean, { nullable: true, defaultValue: false }),
    __metadata("design:type", Boolean)
], GetBookingInput.prototype, "isInProgress", void 0);
__decorate([
    graphql_1.Field((type) => Boolean, { nullable: true, defaultValue: false }),
    __metadata("design:type", Boolean)
], GetBookingInput.prototype, "isComingUp", void 0);
__decorate([
    graphql_1.Field((type) => Boolean, { nullable: true, defaultValue: false }),
    __metadata("design:type", Boolean)
], GetBookingInput.prototype, "isFinished", void 0);
GetBookingInput = __decorate([
    graphql_1.InputType()
], GetBookingInput);
exports.GetBookingInput = GetBookingInput;
let GetBookingOutput = class GetBookingOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => [booking_entity_1.Booking], { nullable: true }),
    __metadata("design:type", Array)
], GetBookingOutput.prototype, "bookings", void 0);
GetBookingOutput = __decorate([
    graphql_1.ObjectType()
], GetBookingOutput);
exports.GetBookingOutput = GetBookingOutput;
//# sourceMappingURL=get-booking.dto.js.map