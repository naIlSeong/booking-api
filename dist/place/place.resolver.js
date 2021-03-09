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
exports.LocationResolver = exports.PlaceResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const role_decorator_1 = require("../auth/role.decorator");
const create_loaction_dto_1 = require("./dto/create-loaction.dto");
const create_place_dto_1 = require("./dto/create-place.dto");
const delete_place_dto_1 = require("./dto/delete-place.dto");
const edit_place_dto_1 = require("./dto/edit-place.dto");
const get_available_place_dto_1 = require("./dto/get-available-place.dto");
const get_location_dto_1 = require("./dto/get-location.dto");
const location_detail_dto_1 = require("./dto/location-detail.dto");
const place_detail_dto_1 = require("./dto/place-detail.dto");
const search_place_dto_1 = require("./dto/search-place.dto");
const toggle_IsAvailable_dto_1 = require("./dto/toggle-IsAvailable.dto");
const location_entity_1 = require("./entity/location.entity");
const place_entity_1 = require("./entity/place.entity");
const place_service_1 = require("./place.service");
let PlaceResolver = class PlaceResolver {
    constructor(placeService) {
        this.placeService = placeService;
    }
    createPlace(createPlaceInput) {
        return this.placeService.createPlace(createPlaceInput);
    }
    toggleIsAvailable(toggleIsAvailableInput) {
        return this.placeService.toggleIsAvailable(toggleIsAvailableInput);
    }
    editPlace(editPlaceInput) {
        return this.placeService.editPlace(editPlaceInput);
    }
    deletePlace(deletePlaceInput) {
        return this.placeService.deletePlace(deletePlaceInput);
    }
    placeDetail(placeDetailInput) {
        return this.placeService.placeDetail(placeDetailInput);
    }
    getAvailablePlace(getAvailablePlaceInput) {
        return this.placeService.getAvailablePlace(getAvailablePlaceInput);
    }
    searchPlace(searchPlaceInput) {
        return this.placeService.searchPlace(searchPlaceInput);
    }
};
__decorate([
    graphql_1.Mutation((returns) => create_place_dto_1.CreatePlaceOutput),
    role_decorator_1.Role(['Admin']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_place_dto_1.CreatePlaceInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "createPlace", null);
__decorate([
    graphql_1.Mutation((returns) => toggle_IsAvailable_dto_1.ToggleIsAvialableOutput),
    role_decorator_1.Role(['Admin']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [toggle_IsAvailable_dto_1.ToggleIsAvialableInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "toggleIsAvailable", null);
__decorate([
    graphql_1.Mutation((returns) => edit_place_dto_1.EditPlaceOutput),
    role_decorator_1.Role(['Admin']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_place_dto_1.EditPlaceInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "editPlace", null);
__decorate([
    graphql_1.Mutation((returns) => delete_place_dto_1.DeletePlaceOutput),
    role_decorator_1.Role(['Admin']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_place_dto_1.DeletePlaceInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "deletePlace", null);
__decorate([
    graphql_1.Query((returns) => place_detail_dto_1.PlaceDetailOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [place_detail_dto_1.PlaceDetailInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "placeDetail", null);
__decorate([
    graphql_1.Query((returns) => get_available_place_dto_1.GetAvailablePlaceOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_available_place_dto_1.GetAvailablePlaceInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "getAvailablePlace", null);
__decorate([
    graphql_1.Query((returns) => search_place_dto_1.SearchPlaceOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_place_dto_1.SearchPlaceInput]),
    __metadata("design:returntype", Promise)
], PlaceResolver.prototype, "searchPlace", null);
PlaceResolver = __decorate([
    graphql_1.Resolver((of) => place_entity_1.Place),
    __metadata("design:paramtypes", [place_service_1.PlaceService])
], PlaceResolver);
exports.PlaceResolver = PlaceResolver;
let LocationResolver = class LocationResolver {
    constructor(placeService) {
        this.placeService = placeService;
    }
    createLocation(createLocationInput) {
        return this.placeService.createLocation(createLocationInput);
    }
    locationDetail(locationDetailInput) {
        return this.placeService.locationDetail(locationDetailInput);
    }
    getLocation() {
        return this.placeService.getLocation();
    }
};
__decorate([
    graphql_1.Mutation((returns) => create_loaction_dto_1.CreateLocationOutput),
    role_decorator_1.Role(['Admin']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_loaction_dto_1.CreateLocationInput]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "createLocation", null);
__decorate([
    graphql_1.Query((returns) => location_detail_dto_1.LocationDetailOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_detail_dto_1.LocationDetailInput]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "locationDetail", null);
__decorate([
    graphql_1.Query((returns) => get_location_dto_1.GetLocationOutput),
    role_decorator_1.Role(['Any']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "getLocation", null);
LocationResolver = __decorate([
    graphql_1.Resolver((of) => location_entity_1.PlaceLocation),
    __metadata("design:paramtypes", [place_service_1.PlaceService])
], LocationResolver);
exports.LocationResolver = LocationResolver;
//# sourceMappingURL=place.resolver.js.map