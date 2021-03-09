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
exports.TeamResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_decorator_1 = require("../auth/auth.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const user_entity_1 = require("../user/entity/user.entity");
const create_team_dto_1 = require("./dto/create-team.dto");
const delete_team_dto_1 = require("./dto/delete-team.dto");
const edit_team_dto_1 = require("./dto/edit-team.dto");
const get_teams_dto_1 = require("./dto/get-teams.dto");
const leave_team_dto_1 = require("./dto/leave-team.dto");
const register_member_dto_1 = require("./dto/register-member.dto");
const search_team_dto_1 = require("./dto/search-team.dto");
const team_detail_dto_1 = require("./dto/team-detail.dto");
const team_entity_1 = require("./entity/team.entity");
const team_service_1 = require("./team.service");
let TeamResolver = class TeamResolver {
    constructor(teamService) {
        this.teamService = teamService;
    }
    createTeam(createTeamInput, individual) {
        return this.teamService.createTeam(createTeamInput, individual.id);
    }
    registerMember(registerMemberInput, individual) {
        return this.teamService.registerMember(registerMemberInput, individual.id);
    }
    editTeam(editTeamInput, user) {
        return this.teamService.editTeam(editTeamInput, user.id);
    }
    teamDetail(teamDetailInput) {
        return this.teamService.teamDetail(teamDetailInput);
    }
    getTeams() {
        return this.teamService.getTeams();
    }
    deleteTeam(user) {
        return this.teamService.deleteTeam(user.id);
    }
    searchTeam(searchTeamInput) {
        return this.teamService.searchTeam(searchTeamInput);
    }
    leaveTeam(member) {
        return this.teamService.leaveTeam(member.id);
    }
};
__decorate([
    graphql_1.Mutation((returns) => create_team_dto_1.CreateTeamOutput),
    role_decorator_1.Role(['Individual']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_team_dto_1.CreateTeamInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "createTeam", null);
__decorate([
    graphql_1.Mutation((returns) => register_member_dto_1.RegisterMemberOutput),
    role_decorator_1.Role(['Individual']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_member_dto_1.RegisterMemberInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "registerMember", null);
__decorate([
    graphql_1.Mutation((returns) => edit_team_dto_1.EditTeamOutput),
    role_decorator_1.Role(['Representative']),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_team_dto_1.EditTeamInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "editTeam", null);
__decorate([
    graphql_1.Query((returns) => team_detail_dto_1.TeamDetailOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_detail_dto_1.TeamDetailInput]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "teamDetail", null);
__decorate([
    graphql_1.Query((returns) => get_teams_dto_1.GetTeamsOutput),
    role_decorator_1.Role(['User']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "getTeams", null);
__decorate([
    graphql_1.Mutation((returns) => delete_team_dto_1.DeleteTeamOutput),
    role_decorator_1.Role(['Representative']),
    __param(0, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "deleteTeam", null);
__decorate([
    graphql_1.Query((returns) => search_team_dto_1.SearchTeamOutput),
    role_decorator_1.Role(['Any']),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_team_dto_1.SearchTeamInput]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "searchTeam", null);
__decorate([
    graphql_1.Mutation((returns) => leave_team_dto_1.LeaveTeamOutput),
    role_decorator_1.Role(['Member']),
    __param(0, auth_decorator_1.AuthUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "leaveTeam", null);
TeamResolver = __decorate([
    graphql_1.Resolver((of) => team_entity_1.Team),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamResolver);
exports.TeamResolver = TeamResolver;
//# sourceMappingURL=team.resolver.js.map