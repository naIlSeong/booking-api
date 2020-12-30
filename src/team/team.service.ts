import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entity/user.entity';
import { Raw, Repository } from 'typeorm';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { DeleteTeamOutput } from './dto/delete-team.dto';
import { EditTeamInput, EditTeamOutput } from './dto/edit-team.dto';
import { GetTeamsOutput } from './dto/get-teams.dto';
import { LeaveTeamOutput } from './dto/leave-team.dto';
import {
  RegisterMemberInput,
  RegisterMemberOutput,
} from './dto/register-member.dto';
import { SearchTeamInput, SearchTeamOutput } from './dto/search-team.dto';
import { TeamDetailInput, TeamDetailOutput } from './dto/team-detail.dto';
import { Team } from './entity/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private generateSlug(teamName: string): string {
    return teamName.trim().toLowerCase().replace(/ /g, '-');
  }

  async createTeam(
    { teamName }: CreateTeamInput,
    individualId: number,
  ): Promise<CreateTeamOutput> {
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
      await this.userRepo.save({
        ...representative,
        role: UserRole.Representative,
      });
      await this.teamRepo.save(team);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async registerMember(
    { teamId }: RegisterMemberInput,
    representativeId: number,
  ): Promise<RegisterMemberOutput> {
    try {
      const individual = await this.userRepo.findOne({ id: representativeId });
      const team = await this.teamRepo.findOne({
        where: { id: teamId },
        relations: ['members'],
      });
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
      team.members.push(individual);
      await this.teamRepo.save(team);
      await this.userRepo.save({ ...individual, team, role: UserRole.Member });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async editTeam(
    { teamName }: EditTeamInput,
    representativeId: number,
  ): Promise<EditTeamOutput> {
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
      await this.teamRepo.save({ ...team, teamName, teamNameSlug });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async teamDetail({ teamId }: TeamDetailInput): Promise<TeamDetailOutput> {
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
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async getTeams(): Promise<GetTeamsOutput> {
    try {
      const teams = await this.teamRepo.find({ relations: ['members'] });
      return {
        ok: true,
        teams,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async deleteTeam(representativeId: number): Promise<DeleteTeamOutput> {
    try {
      const representative = await this.userRepo.findOne({
        id: representativeId,
      });
      const team = await this.teamRepo.findOne({
        where: { id: representative.teamId },
        relations: ['members'],
      });

      representative.role = UserRole.Individual;
      team.members.map(async (member) => {
        member.role = UserRole.Individual;
        await this.userRepo.save(member);
      });

      await this.userRepo.save(representative);
      await this.teamRepo.delete({ id: team.id });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async searchTeam({ query }: SearchTeamInput): Promise<SearchTeamOutput> {
    try {
      const querySlug = this.generateSlug(query);
      const teams = await this.teamRepo.find({
        where: {
          teamNameSlug: Raw(
            (teamNameSlug) => `${teamNameSlug} ILIKE '%${querySlug}%'`,
          ),
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
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async leaveTeam(memberId: number): Promise<LeaveTeamOutput> {
    try {
      const user = await this.userRepo.findOne({ id: memberId });
      const team = await this.teamRepo.findOne({
        where: {
          id: user.team.id,
        },
        relations: ['members'],
      });
      const members = team.members.filter((member) => member.id !== user.id);

      await this.teamRepo.save({ ...team, members });
      await this.userRepo.save({
        ...user,
        team: null,
        role: UserRole.Individual,
      });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }
}
