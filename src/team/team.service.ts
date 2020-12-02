import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { Team } from './entity/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
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
}
