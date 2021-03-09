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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("./entity/team.entity");
let TeamService = class TeamService {
    constructor(teamRepo, userRepo) {
        this.teamRepo = teamRepo;
        this.userRepo = userRepo;
    }
    generateSlug(teamName) {
        return teamName.trim().toLowerCase().replace(/ /g, '-');
    }
    async createTeam({ teamName }, individualId) {
        try {
            const representative = await this.userRepo.findOne({ id: individualId });
            const teamNameSlug = this.generateSlug(teamName);
            const existSlug = await this.teamRepo.findOne({ teamNameSlug });
            const exist = await this.teamRepo.findOne({ teamName });
            if (exist || existSlug) {
                return {
                    ok: false,
                    error: 'Already team name exist',
                };
            }
            const team = this.teamRepo.create({
                teamName,
                teamNameSlug,
                members: [representative],
            });
            await this.userRepo.save(Object.assign(Object.assign({}, representative), { role: user_entity_1.UserRole.Representative }));
            await this.teamRepo.save(team);
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
    async registerMember({ teamId }, representativeId) {
        try {
            const individual = await this.userRepo.findOne({ id: representativeId });
            if (!individual) {
                return {
                    ok: false,
                    error: 'User not found',
                };
            }
            if (individual.teamId) {
                return {
                    ok: false,
                    error: 'Already has team',
                };
            }
            const team = await this.teamRepo.findOne({
                where: { id: teamId },
                relations: ['members'],
            });
            if (!team) {
                return {
                    ok: false,
                    error: 'Team not found',
                };
            }
            team.members.push(individual);
            await this.teamRepo.save(team);
            await this.userRepo.save(Object.assign(Object.assign({}, individual), { team, role: user_entity_1.UserRole.Member }));
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
    async editTeam({ teamName }, representativeId) {
        try {
            const representative = await this.userRepo.findOne({
                id: representativeId,
            });
            const team = await this.teamRepo.findOne({ id: representative.teamId });
            const teamNameSlug = this.generateSlug(teamName);
            const existSlug = await this.teamRepo.findOne({ teamNameSlug });
            const exist = await this.teamRepo.findOne({ teamName });
            if (exist || existSlug) {
                if (exist.id === team.id) {
                    return {
                        ok: false,
                        error: 'Same team name',
                    };
                }
                return {
                    ok: false,
                    error: 'Already team exist',
                };
            }
            await this.teamRepo.save(Object.assign(Object.assign({}, team), { teamName, teamNameSlug }));
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
    async teamDetail({ teamId }) {
        try {
            const team = await this.teamRepo.findOne({
                where: { id: teamId },
                relations: ['members', 'bookings'],
            });
            if (!team) {
                return {
                    ok: false,
                    error: 'Team not found',
                };
            }
            return {
                ok: true,
                team,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async getTeams() {
        try {
            const teams = await this.teamRepo.find({ relations: ['members'] });
            return {
                ok: true,
                teams,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async deleteTeam(representativeId) {
        try {
            const representative = await this.userRepo.findOne({
                id: representativeId,
            });
            const team = await this.teamRepo.findOne({
                where: { id: representative.teamId },
                relations: ['members'],
            });
            representative.role = user_entity_1.UserRole.Individual;
            team.members.map(async (member) => {
                member.role = user_entity_1.UserRole.Individual;
                await this.userRepo.save(member);
            });
            await this.userRepo.save(representative);
            await this.teamRepo.delete({ id: team.id });
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
    async searchTeam({ query }) {
        try {
            const querySlug = this.generateSlug(query);
            const teams = await this.teamRepo.find({
                where: {
                    teamNameSlug: typeorm_2.Raw((teamNameSlug) => `${teamNameSlug} ILIKE '%${querySlug}%'`),
                },
                relations: ['members'],
            });
            if (!teams) {
                return {
                    ok: false,
                    error: 'Team not found',
                };
            }
            return {
                ok: true,
                teams,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: 'Unexpected Error',
            };
        }
    }
    async leaveTeam(memberId) {
        try {
            const user = await this.userRepo.findOne({ id: memberId });
            const team = await this.teamRepo.findOne({
                where: {
                    id: user.team.id,
                },
                relations: ['members'],
            });
            const members = team.members.filter((member) => member.id !== user.id);
            await this.teamRepo.save(Object.assign(Object.assign({}, team), { members }));
            await this.userRepo.save(Object.assign(Object.assign({}, user), { team: null, role: user_entity_1.UserRole.Individual }));
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
TeamService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(team_entity_1.Team)),
    __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map