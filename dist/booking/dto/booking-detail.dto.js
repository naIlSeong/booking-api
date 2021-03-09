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
exports.BookingDetailOutput = exports.BookingDetailInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const booking_entity_1 = require("../entity/booking.entity");
let BookingDetailInput = class BookingDetailInput {
};
__decorate([
    graphql_1.Field((type) => graphql_1.Int),
    __metadata("design:type", Number)
], BookingDetailInput.prototype, "bookingId", void 0);
BookingDetailInput = __decorate([
    graphql_1.InputType()
], BookingDetailInput);
exports.BookingDetailInput = BookingDetailInput;
let BookingDetailOutput = class BookingDetailOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => booking_entity_1.Booking, { nullable: true }),
    __metadata("design:type", booking_entity_1.Booking)
], BookingDetailOutput.prototype, "booking", void 0);
BookingDetailOutput = __decorate([
    graphql_1.ObjectType()
], BookingDetailOutput);
exports.BookingDetailOutput = BookingDetailOutput;
//# sourceMappingURL=booking-detail.dto.js.map