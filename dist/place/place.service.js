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
exports.PlaceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_entity_1 = require("./entity/location.entity");
const place_entity_1 = require("./entity/place.entity");
let PlaceService = class PlaceService {
    constructor(placeRepo, locationRepo) {
        this.placeRepo = placeRepo;
        this.locationRepo = locationRepo;
    }
    generateSlug(placeName) {
        return placeName.trim().toLowerCase().replace(/ /g, '-');
    }
    async findPlaceAndLocation(locationId, placeId) {
        const placeLocation = await this.locationRepo.findOne({
            id: locationId,
        });
        if (!placeLocation) {
            return { error: 'Location not found' };
        }
        const place = await this.placeRepo.findOne({
            id: placeId,
            placeLocation,
        });
        if (!place) {
            return { error: 'Place not found' };
        }
        return { placeLocation, place };
    }
    async createPlace({ placeName, locationId, }) {
        try {
            const placeLocation = await this.locationRepo.findOne({ id: locationId });
            if (!placeLocation) {
                return {
                    ok: false,
                    error: 'Location not found',
                };
            }
            const placeNameSlug = this.generateSlug(placeName);
            const exist = await this.placeRepo.findOne({
                placeName,
                placeLocation,
            });
            const existSlug = await this.placeRepo.findOne({
                placeNameSlug,
                placeLocation,
            });
            if (exist || existSlug) {
                return {
                    ok: false,
                    error: 'Already place exist',
                };
            }
            await this.placeRepo.save(this.placeRepo.create({ placeName, placeNameSlug, placeLocation }));
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
    async toggleIsAvailable({ id: placeId, }) {
        try {
            const place = await this.placeRepo.findOne({ id: placeId });
            if (!place) {
                return {
                    ok: false,
                    error: 'Place not found',
                };
            }
            place.isAvailable = !place.isAvailable;
            await this.placeRepo.save(place);
            return {
                ok: true,
                isAvailable: place.isAvailable,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async editPlace({ placeName, inUse, placeId, locationId, }) {
        try {
            const { placeLocation, place, error } = await this.findPlaceAndLocation(locationId, placeId);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            const placeNameSlug = this.generateSlug(placeName);
            const existPlaceNameSlug = await this.placeRepo.findOne({
                placeNameSlug,
                placeLocation,
            });
            const existPlaceName = await this.placeRepo.findOne({
                placeName,
                placeLocation,
            });
            if (existPlaceName || existPlaceNameSlug) {
                if (existPlaceName.id === place.id) {
                    return {
                        ok: false,
                        error: 'Same place name',
                    };
                }
                return {
                    ok: false,
                    error: 'Already exist place name',
                };
            }
            await this.placeRepo.save([
                Object.assign(Object.assign({}, place), { inUse, placeName, placeNameSlug }),
            ]);
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
    async deletePlace({ placeId, locationId, }) {
        try {
            const { error, place } = await this.findPlaceAndLocation(locationId, placeId);
            if (error) {
                return {
                    ok: false,
                    error,
                };
            }
            if (place.inUse === true || place.isAvailable === true) {
                return {
                    ok: false,
                    error: "Check 'inUse' and 'isAvailable' is false",
                };
            }
            await this.placeRepo.delete(placeId);
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
    async placeDetail({ placeId }) {
        try {
            const place = await this.placeRepo.findOne({
                where: {
                    id: placeId,
                },
                relations: ['bookings', 'placeLocation'],
            });
            if (!place) {
                return {
                    ok: false,
                    error: 'Place not found',
                };
            }
            return {
                ok: true,
                place,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async createLocation({ locationName, }) {
        try {
            const locationNameSlug = this.generateSlug(locationName);
            const existSlug = await this.locationRepo.findOne({ locationNameSlug });
            const exist = await this.locationRepo.findOne({ locationName });
            if (exist || existSlug) {
                return {
                    ok: false,
                    error: 'Already location exist',
                };
            }
            await this.locationRepo.save(this.locationRepo.create({ locationName, locationNameSlug }));
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
    async locationDetail({ locationId, }) {
        try {
            const location = await this.locationRepo.findOne({
                where: {
                    id: locationId,
                },
                relations: ['places'],
            });
            if (!location) {
                return {
                    ok: false,
                    error: 'Location not found',
                };
            }
            return {
                ok: true,
                location,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async getLocation() {
        try {
            const locations = await this.locationRepo.find({
                where: { isAvailable: true },
                relations: ['places'],
            });
            const availableLocation = [];
            locations.forEach((location) => {
                if (location.places.length !== 0) {
                    availableLocation.push(location);
                }
            });
            return {
                ok: true,
                locations: availableLocation,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async getAvailablePlace({ locationId, }) {
        try {
            const places = await this.placeRepo.find({
                placeLocation: { id: locationId },
                isAvailable: true,
            });
            if (!places) {
                return {
                    ok: false,
                    error: 'Place not found',
                };
            }
            if (places.length === 0) {
                return {
                    ok: false,
                    error: 'Available place not found',
                };
            }
            return {
                ok: true,
                places,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async searchPlace({ query }) {
        try {
            const querySlug = this.generateSlug(query);
            const places = await this.placeRepo.find({
                where: {
                    placeNameSlug: typeorm_2.Raw((placeNameSlug) => `${placeNameSlug} ILIKE '%${querySlug}%'`),
                },
            });
            if (!places) {
                return {
                    ok: false,
                    error: 'Place not found',
                };
            }
            return {
                ok: true,
                places,
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
PlaceService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(place_entity_1.Place)),
    __param(1, typeorm_1.InjectRepository(location_entity_1.PlaceLocation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlaceService);
exports.PlaceService = PlaceService;
//# sourceMappingURL=place.service.js.map