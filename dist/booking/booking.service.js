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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_dto_1 = require("../common/dto/common.dto");
const place_entity_1 = require("../place/entity/place.entity");
const team_entity_1 = require("../team/entity/team.entity");
const user_entity_1 = require("../user/entity/user.entity");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entity/booking.entity");
let BookingService = class BookingService {
    constructor(bookingRepo, userRepo, placeRepo, teamRepo) {
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
        this.placeRepo = placeRepo;
        this.teamRepo = teamRepo;
    }
    async isCreatableBooking(place, startAt, endAt, isEdit, bookingId) {
        const startFirst = await this.bookingRepo.find({
            place,
            startAt: typeorm_2.LessThanOrEqual(startAt),
            endAt: typeorm_2.MoreThan(startAt),
        });
        const startLater1 = await this.bookingRepo.find({
            place,
            startAt: typeorm_2.MoreThan(startAt),
        });
        const startLater2 = await this.bookingRepo.find({
            place,
            startAt: typeorm_2.LessThan(endAt),
        });
        const startLater = [];
        startLater1.forEach((a) => startLater2.forEach((b) => {
            if (a.id === b.id) {
                startLater.push(a);
            }
        }));
        const error = 'Already booking exist';
        if (startFirst.length !== 0 || startLater.length !== 0) {
            if (!isEdit) {
                return error;
            }
            if ((startFirst.length === 1 &&
                startFirst[0].id === bookingId &&
                startLater.length === 0) ||
                (startFirst.length === 0 &&
                    startLater.length === 1 &&
                    startLater[0].id === bookingId) === false) {
                return error;
            }
        }
        return;
    }
    async isAvailablePlace(placeId) {
        const place = await this.placeRepo.findOne({
            id: placeId,
        });
        if (!place) {
            return { error: 'Place not found' };
        }
        if (place.isAvailable === false) {
            return { error: 'Place not available' };
        }
        return { place };
    }
    isCreatorsBooking(booking, creatorId, checkState) {
        if (!booking) {
            return 'Booking not found';
        }
        if (booking.creatorId !== creatorId) {
            return "You can't do this";
        }
        if (checkState) {
            if (booking.isFinished === true) {
                return 'Already finished';
            }
            if (booking.inUse === false) {
                return 'Not in use';
            }
        }
        return;
    }
    async checkInUse() {
        try {
            const now = new Date();
            const nowInUse = await this.bookingRepo.find({
                where: { startAt: typeorm_2.LessThan(now), endAt: typeorm_2.MoreThan(now) },
                relations: ['place'],
            });
            nowInUse.forEach(async (booking) => {
                if (booking.inUse === false && booking.isFinished === false) {
                    booking.inUse = true;
                    await this.placeRepo.save(Object.assign(Object.assign({}, booking.place), { inUse: true }));
                    await this.bookingRepo.save(booking);
                }
            });
            const canExtendBooking = await this.bookingRepo.find({
                inUse: true,
                isFinished: false,
            });
            canExtendBooking.forEach(async (booking) => {
                if (booking.endAt.valueOf() - now.valueOf() <= 600000) {
                    booking.canExtend = true;
                    await this.bookingRepo.save(booking);
                }
                else {
                    booking.canExtend = false;
                    await this.bookingRepo.save(booking);
                }
            });
            const finishedInUse = await this.bookingRepo.find({
                where: { endAt: typeorm_2.LessThan(now), isFinished: false },
                relations: ['place'],
            });
            finishedInUse.forEach(async (booking) => {
                if (booking.inUse === true) {
                    booking.inUse = false;
                }
                if (booking.isFinished === false) {
                    booking.isFinished = true;
                }
                if (booking.canExtend === true) {
                    booking.canExtend = false;
                }
                await this.placeRepo.save(Object.assign(Object.assign({}, booking.place), { inUse: false }));
                await this.bookingRepo.save(booking);
            });
        }
        catch (error) {
            Promise.reject({ error: 'Fail to check' });
        }
    }
    async createBooking({ startAt, endAt, placeId, withTeam }, creatorId) {
        try {
            const creator = await this.userRepo.findOne({ id: creatorId });
            const { error, place } = await this.isAvailablePlace(placeId);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            const newError = await this.isCreatableBooking(place, startAt, endAt, false);
            if (newError) {
                return {
                    ok: false,
                    error: newError,
                };
            }
            const booking = this.bookingRepo.create({
                creator,
                place,
                startAt,
                endAt,
            });
            if (withTeam && withTeam === true) {
                if (!creator.team || creator.role === user_entity_1.UserRole.Individual) {
                    return {
                        ok: false,
                        error: "You don't have team",
                    };
                }
                booking.team = creator.team;
            }
            await this.bookingRepo.save(booking);
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async bookingDetail({ bookingId, }) {
        try {
            const booking = await this.bookingRepo.findOne(bookingId, {
                relations: ['place', 'team', 'creator'],
            });
            if (!booking) {
                return {
                    ok: false,
                    error: 'Booking not found',
                };
            }
            return {
                ok: true,
                booking,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async findConditionalBooking({ creator, place, isFinished, inUse, order, }) {
        if (place) {
            return this.bookingRepo.find({
                relations: ['place', 'team'],
                where: {
                    place,
                    isFinished,
                    inUse,
                },
                order: {
                    startAt: order,
                },
            });
        }
        return this.bookingRepo.find({
            relations: ['place', 'team'],
            where: {
                creator,
                isFinished,
                inUse,
            },
            order: {
                startAt: order,
            },
        });
    }
    async getBooking(creatorId, { placeId, isInProgress, isComingUp, isFinished }) {
        try {
            let bookings;
            let place;
            const creator = await this.userRepo.findOne({ id: creatorId });
            if (placeId) {
                place = await this.placeRepo.findOne({
                    id: placeId,
                });
            }
            if (isInProgress === true) {
                bookings = await this.findConditionalBooking({
                    creator,
                    isFinished: false,
                    inUse: true,
                    order: 'ASC',
                });
                if (placeId) {
                    bookings = await this.findConditionalBooking({
                        place,
                        isFinished: false,
                        inUse: true,
                        order: 'ASC',
                    });
                }
                return {
                    ok: true,
                    bookings,
                };
            }
            if (isComingUp === true) {
                bookings = await this.findConditionalBooking({
                    creator,
                    isFinished: false,
                    inUse: false,
                    order: 'ASC',
                });
                if (placeId) {
                    bookings = await this.findConditionalBooking({
                        place,
                        isFinished: false,
                        inUse: false,
                        order: 'ASC',
                    });
                }
                return {
                    ok: true,
                    bookings,
                };
            }
            if (isFinished === true) {
                bookings = await this.findConditionalBooking({
                    creator,
                    isFinished: true,
                    inUse: false,
                    order: 'DESC',
                });
                return {
                    ok: true,
                    bookings,
                };
            }
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async deleteBooking({ bookingId }, creatorId) {
        try {
            const booking = await this.bookingRepo.findOne({ id: bookingId });
            const error = this.isCreatorsBooking(booking, creatorId, false);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            await this.bookingRepo.delete(bookingId);
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async editBooking({ startAt, endAt, bookingId, placeId, withTeam }, creatorId) {
        try {
            const booking = await this.bookingRepo.findOne({
                where: {
                    id: bookingId,
                },
                relations: ['place', 'team'],
            });
            let error;
            error = this.isCreatorsBooking(booking, creatorId, false);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            if (booking.inUse === true) {
                return {
                    ok: false,
                    error: "You can't do this in use",
                };
            }
            if (placeId) {
                const { error, place } = await this.isAvailablePlace(placeId);
                if (error) {
                    return {
                        ok: false,
                        error,
                    };
                }
                booking.place = place;
            }
            const place = booking.place;
            if (!startAt && !endAt) {
                startAt = booking.startAt;
                endAt = booking.endAt;
            }
            error = await this.isCreatableBooking(place, startAt, endAt, true, bookingId);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            if (withTeam === true) {
                const creator = await this.userRepo.findOne({ id: creatorId });
                if (!creator.team) {
                    return {
                        ok: false,
                        error: "You don't have team",
                    };
                }
                booking.team = creator.team;
            }
            if (withTeam === false) {
                booking.team = null;
            }
            await this.bookingRepo.save(Object.assign(Object.assign({}, booking), { startAt, endAt }));
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async createInUse({ placeId, withTeam }, creatorId) {
        try {
            const creator = await this.userRepo.findOne({ id: creatorId });
            const { error, place } = await this.isAvailablePlace(placeId);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            const startAt = new Date();
            const endAt = new Date(startAt.getTime() + 3600000);
            const newError = await this.isCreatableBooking(place, startAt, endAt, false);
            if (newError) {
                return {
                    ok: false,
                    error: newError,
                };
            }
            const booking = this.bookingRepo.create({
                startAt,
                endAt,
                place,
                creator,
                inUse: true,
            });
            if (withTeam && withTeam === true) {
                if (!creator.team || creator.role === user_entity_1.UserRole.Individual) {
                    return {
                        ok: false,
                        error: "You don't have team",
                    };
                }
                booking.team = creator.team;
            }
            await this.placeRepo.save(Object.assign(Object.assign({}, place), { inUse: true }));
            await this.bookingRepo.save(booking);
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async extendInUse({ bookingId }, creatorId) {
        try {
            const booking = await this.bookingRepo.findOne({ id: bookingId });
            const error = this.isCreatorsBooking(booking, creatorId, true);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            const now = new Date();
            if (booking.endAt.valueOf() - now.valueOf() > 600000 &&
                booking.canExtend === false) {
                return {
                    ok: false,
                    error: "Can't extend now",
                };
            }
            await this.bookingRepo.save(Object.assign(Object.assign({}, booking), { endAt: new Date(booking.endAt.getTime() + 1800000), canExtend: false }));
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async finishInUse({ bookingId }, creatorId) {
        try {
            const booking = await this.bookingRepo.findOne({
                where: { id: bookingId },
                relations: ['place'],
            });
            const error = this.isCreatorsBooking(booking, creatorId, true);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            await this.placeRepo.save(Object.assign(Object.assign({}, booking.place), { inUse: false }));
            await this.bookingRepo.save(Object.assign(Object.assign({}, booking), { inUse: false, isFinished: true, endAt: new Date() }));
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async editBookingForTest(bookingId) {
        try {
            const booking = await this.bookingRepo.findOne({ id: bookingId });
            booking.startAt = new Date(booking.startAt.valueOf() - 3300000);
            booking.endAt = new Date(booking.endAt.valueOf() - 3300000);
            await this.bookingRepo.save(booking);
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
};
BookingService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(booking_entity_1.Booking)),
    __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(2, typeorm_1.InjectRepository(place_entity_1.Place)),
    __param(3, typeorm_1.InjectRepository(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map