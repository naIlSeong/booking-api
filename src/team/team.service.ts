import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import {
  RegisterMemberInput,
  RegisterMemberOutput,
} from './dto/register-member.dto';
import { Team } from './entity/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createTeam(
    { teamName }: CreateTeamInput,
    user: User,
  ): Promise<CreateTeamOutput> {
    try {
      const exist = await this.teamRepo.findOne({ teamName });
      if (exist) {
        return {
          ok: false,
          error: 'Already team exist',
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
    user: User,
  ): Promise<RegisterMemberOutput> {
    try {
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
        error,
      };
    }
  }
}
