import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { DeleteTeamInput, DeleteTeamOutput } from './dto/delete-team.dto';
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
    userId: number,
  ): Promise<CreateTeamOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      const exist = await this.teamRepo.findOne({ teamName });
      if (exist) {
        return {
          ok: false,
          error: 'Already team name exist',
        };
      }
      if (user.teamId) {
        return {
          ok: false,
          error: 'Already has team',
        };
      }
      const team = this.teamRepo.create({
        teamName,
        members: [user],
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
    userId: number,
  ): Promise<RegisterMemberOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (!user.teamId) {
        return {
          ok: false,
          error: 'Not have a team',
        };
      }
      const team = await this.teamRepo.findOne({
        where: { id: user.teamId },
        relations: ['members'],
      });
      if (!team) {
        return {
          ok: false,
          error: 'Team not found',
        };
      }
      if (user.teamId !== team.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }

      const member = await this.userRepo.findOne({ id: memberId });
      if (!member) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (member.teamId) {
        return {
          ok: false,
          error: 'Already has team',
        };
      }
      team.members.push(member);
      member.team = team;
      await this.teamRepo.save(team);
      await this.userRepo.save(member);

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
    { teamId, teamName }: EditTeamInput,
    userId: number,
  ): Promise<EditTeamOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (!user.teamId) {
        return {
          ok: false,
          error: 'Not have a team',
        };
      }
      const team = await this.teamRepo.findOne({ id: teamId });
      if (!team) {
        return {
          ok: false,
          error: 'Team not found',
        };
      }
      if (user.teamId !== team.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }
      const exist = await this.teamRepo.findOne({ teamName });
      if (exist) {
        return {
          ok: false,
          error: 'Already team exist',
        };
      }

      team.teamName = teamName;
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
      const teams = await this.teamRepo.find();

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

  async deleteTeam(
    { teamId }: DeleteTeamInput,
    userId: number,
  ): Promise<DeleteTeamOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (!user.teamId) {
        return {
          ok: false,
          error: 'Not have a team',
        };
      }
      const team = await this.teamRepo.findOne({ id: teamId });
      if (!team) {
        return {
          ok: false,
          error: 'Team not found',
        };
      }
      if (user.teamId !== team.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }

      await this.teamRepo.delete({ id: teamId });
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
