"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTeamOutput = exports.EditTeamInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/dto/common.dto");
const team_entity_1 = require("../entity/team.entity");
let EditTeamInput = class EditTeamInput extends graphql_1.PickType(team_entity_1.Team, ['teamName']) {
};
EditTeamInput = __decorate([
    graphql_1.InputType()
], EditTeamInput);
exports.EditTeamInput = EditTeamInput;
let EditTeamOutput = class EditTeamOutput extends common_dto_1.CoreOutput {
};
EditTeamOutput = __decorate([
    graphql_1.ObjectType()
], EditTeamOutput);
exports.EditTeamOutput = EditTeamOutput;
//# sourceMappingURL=edit-team.dto.js.map