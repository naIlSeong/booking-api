import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { DeleteTeamOutput } from './dto/delete-team.dto';
import { EditTeamInput, EditTeamOutput } from './dto/edit-team.dto';
import { GetTeamsOutput } from './dto/get-teams.dto';
import {
  RegisterMemberInput,
  RegisterMemberOutput,
} from './dto/register-member.dto';
import { TeamDetailInput, TeamDetailOutput } from './dto/team-detail.dto';
import { Team } from './entity/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createTeam(
    { teamName }: CreateTeamInput,
    individualId: number,
  ): Promise<CreateTeamOutput> {
    try {
      const representative = await this.userRepo.findOne({ id: individualId });
      const exist = await this.teamRepo.findOne({ teamName });
      if (exist) {
        return {
          ok: false,
          error: 'Already team name exist',
        };
      }
      const team = this.teamRepo.create({
        teamName,
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
    { memberId }: RegisterMemberInput,
    representativeId: number,
  ): Promise<RegisterMemberOutput> {
    try {
      const user = await this.userRepo.findOne({ id: representativeId });
      const team = await this.teamRepo.findOne({
        where: { id: user.teamId },
        relations: ['members'],
      });
      const member = await this.userRepo.findOne({ id: memberId });
      if (!member) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (member.teamId && member.role !== UserRole.Individual) {
        return {
          ok: false,
          error: 'Already has team',
        };
      }
      team.members.push(member);
      await this.teamRepo.save(team);
      await this.userRepo.save({ ...member, team, role: UserRole.Member });

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
      const exist = await this.teamRepo.findOne({ teamName });
      if (exist) {
        if (exist.id !== team.id) {
          return {
            ok: false,
            error: 'Already team exist',
          };
        }
        return {
          ok: false,
          error: 'Same team name',
        };
      }
      await this.teamRepo.save({ ...team, teamName });
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
}
