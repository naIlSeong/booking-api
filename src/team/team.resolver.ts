import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
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
import { TeamService } from './team.service';

@Resolver((of) => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Mutation((returns) => CreateTeamOutput)
  @Role(['Individual'])
  createTeam(
    @Args('input') createTeamInput: CreateTeamInput,
    @AuthUser() individual: User,
  ): Promise<CreateTeamOutput> {
    return this.teamService.createTeam(createTeamInput, individual.id);
  }

  @Mutation((returns) => RegisterMemberOutput)
  @Role(['Individual'])
  registerMember(
    @Args('input') registerMemberInput: RegisterMemberInput,
    @AuthUser() individual: User,
  ): Promise<RegisterMemberOutput> {
    return this.teamService.registerMember(registerMemberInput, individual.id);
  }

  @Mutation((returns) => EditTeamOutput)
  @Role(['Representative'])
  editTeam(
    @Args('input') editTeamInput: EditTeamInput,
    @AuthUser() user: User,
  ): Promise<EditTeamOutput> {
    return this.teamService.editTeam(editTeamInput, user.id);
  }

  @Query((returns) => TeamDetailOutput)
  @Role(['Any'])
  teamDetail(
    @Args('input') teamDetailInput: TeamDetailInput,
  ): Promise<TeamDetailOutput> {
    return this.teamService.teamDetail(teamDetailInput);
  }

  @Query((returns) => GetTeamsOutput)
  @Role(['User'])
  getTeams(): Promise<GetTeamsOutput> {
    return this.teamService.getTeams();
  }

  @Mutation((returns) => DeleteTeamOutput)
  @Role(['Representative'])
  deleteTeam(@AuthUser() user: User): Promise<DeleteTeamOutput> {
    return this.teamService.deleteTeam(user.id);
  }

  @Query((returns) => SearchTeamOutput)
  @Role(['Any'])
  searchTeam(
    @Args('input') searchTeamInput: SearchTeamInput,
  ): Promise<SearchTeamOutput> {
    return this.teamService.searchTeam(searchTeamInput);
  }

  @Mutation((returns) => LeaveTeamOutput)
  @Role(['Member'])
  leaveTeam(@AuthUser() member: User): Promise<LeaveTeamOutput> {
    return this.teamService.leaveTeam(member.id);
  }
}
