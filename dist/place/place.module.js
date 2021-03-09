"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceModule = void 0;
const common_1 = require("@nestjs/common");
const place_service_1 = require("./place.service");
const place_resolver_1 = require("./place.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const place_entity_1 = require("./entity/place.entity");
const location_entity_1 = require("./entity/location.entity");
let PlaceModule = class PlaceModule {
};
PlaceModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([place_entity_1.Place, location_entity_1.PlaceLocation])],
        providers: [place_service_1.PlaceService, place_resolver_1.PlaceResolver, place_resolver_1.LocationResolver],
    })
], PlaceModule);
exports.PlaceModule = PlaceModule;
//# sourceMappingURL=place.module.js.map