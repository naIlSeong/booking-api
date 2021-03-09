"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModule = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const team_resolver_1 = require("./team.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const team_entity_1 = require("./entity/team.entity");
const user_entity_1 = require("../user/entity/user.entity");
let TeamModule = class TeamModule {
};
TeamModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([team_entity_1.Team, user_entity_1.User])],
        providers: [team_service_1.TeamService, team_resolver_1.TeamResolver],
    })
], TeamModule);
exports.TeamModule = TeamModule;
//# sourceMappingURL=team.module.js.map