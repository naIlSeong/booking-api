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
exports.SearchTeamOutput = exports.SearchTeamInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const team_entity_1 = require("../entity/team.entity");
let SearchTeamInput = class SearchTeamInput {
};
__decorate([
    graphql_1.Field((type) => String),
    __metadata("design:type", String)
], SearchTeamInput.prototype, "query", void 0);
SearchTeamInput = __decorate([
    graphql_1.InputType()
], SearchTeamInput);
exports.SearchTeamInput = SearchTeamInput;
let SearchTeamOutput = class SearchTeamOutput extends common_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field((type) => [team_entity_1.Team], { nullable: true }),
    __metadata("design:type", Array)
], SearchTeamOutput.prototype, "teams", void 0);
SearchTeamOutput = __decorate([
    graphql_1.ObjectType()
], SearchTeamOutput);
exports.SearchTeamOutput = SearchTeamOutput;
//# sourceMappingURL=search-team.dto.js.map