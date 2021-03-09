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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const schedule_1 = require("@nestjs/schedule");
const auth_decorator_1 = require("../auth/auth.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const common_dto_1 = require("../common/dto/common.dto");
const user_entity_1 = require("../user/entity/user.entity");
const booking_service_1 = require("./booking.service");
const booking_detail_dto_1 = require("./dto/booking-detail.dto");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const create_in_use_dto_1 = require("./dto/create-in-use.dto");
const delete_booking_dto_1 = require("./dto/delete-booking.dto");
const edit_booking_dto_1 = require("./dto/edit-booking.dto");
const extend_in_use_dto_1 = require("./dto/extend-in-use.dto");
const finish_in_use_dto_1 = require("./dto/finish-in-use.dto");
const get_booking_dto_1 = require("./dto/get-booking.dto");
const booking_entity_1 = require("./entity/booking.entity");
let BookingResolver = class BookingResolver {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    createBooking(createBookingInput, creator) {
        return this.bookingService.createBooking(createBookingInput, creator.id);
    }
    bookingDetail(bookingDetailInput) {
        return this.bookingService.bookingDetail(bookingDetailInput);
    }
    getBooking(creator, getBookingInput) {
        return this.bookingService.getBooking(creator.id, getBookingInput);
    }
    deleteBooking(deleteBookingInput, creator) {
        return this.bookingService.deleteBooking(deleteBookingInput, creator.id);
    }
    editBooking(editBookingInput, creator) {
        return this.bookingService.editBooking(editBookingInput, creator.id);
    }
    editBookingForTest(bookingId) {
        return this.bookingService.editBookingForTest(bookingId);
    }
    createInUse(createInUseInput, creator) {
        return this.bookingService.createInUse(createInUseInput, creator.id);
    }
    checkInUse() {
        return this.bookingService.checkInUse();
    }
    extendInUse(extendInUseInput, creator) {
        return this.bookingService.extendInUse(extendInUseInput, creator.id);
    }
    finishInUse(finishInUseInput, creator) {
        return this.bookingService.finishInUse(finishInUseInput, creator.id);
    }
};
__decorate([
    graphql_1.Mutation((returns) => create_booking_dto_1.CreateBookingOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "createBooking", null);
__decorate([
    graphql_1.Query((returns) => booking_detail_dto_1.BookingDetailOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_detail_dto_1.BookingDetailInput]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "bookingDetail", null);
__decorate([
    graphql_1.Query((returns) => get_booking_dto_1.GetBookingOutput),
    role_decorator_1.Role(['Any']),
    __param(0, auth_decorator_1.AuthUser()),
    __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_booking_dto_1.GetBookingInput]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "getBooking", null);
__decorate([
    graphql_1.Mutation((returns) => delete_booking_dto_1.DeleteBookingOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_booking_dto_1.DeleteBookingInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "deleteBooking", null);
__decorate([
    graphql_1.Mutation((returns) => edit_booking_dto_1.EditBookingOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_booking_dto_1.EditBookingInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "editBooking", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CoreOutput),
    role_decorator_1.Role(['Admin']),
    __param(0, graphql_1.Args('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "editBookingForTest", null);
__decorate([
    graphql_1.Mutation((returns) => create_in_use_dto_1.CreateInUseOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_in_use_dto_1.CreateInUseInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "createInUse", null);
__decorate([
    schedule_1.Cron('*/30 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingResolver.prototype, "checkInUse", null);
__decorate([
    graphql_1.Mutation((returns) => extend_in_use_dto_1.ExtendInUseOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [extend_in_use_dto_1.ExtendInUseInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "extendInUse", null);
__decorate([
    graphql_1.Mutation((returns) => finish_in_use_dto_1.FinishInUseOutput),
    role_decorator_1.Role(['User']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finish_in_use_dto_1.FinishInUseInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookingResolver.prototype, "finishInUse", null);
BookingResolver = __decorate([
    graphql_1.Resolver((of) => booking_entity_1.Booking),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingResolver);
exports.BookingResolver = BookingResolver;
//# sourceMappingURL=booking.resolver.js.map