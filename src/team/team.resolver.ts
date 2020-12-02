import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { EditTeamInput, EditTeamOutput } from './dto/edit-team.dto';
import {
  RegisterMemberInput,
  RegisterMemberOutput,
} from './dto/register-member.dto';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

@Resolver((of) => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Mutation((returns) => CreateTeamOutput)
  @Role(['User'])
  createTeam(
    @Args('input') createTeamInput: CreateTeamInput,
    @AuthUser() user: User,
  ): Promise<CreateTeamOutput> {
    return this.teamService.createTeam(createTeamInput, user);
  }

  @Mutation((returns) => RegisterMemberOutput)
  @Role(['User'])
  registerMember(
    @Args('input') registerMemberInput: RegisterMemberInput,
    @AuthUser() user: User,
  ): Promise<RegisterMemberOutput> {
    return this.teamService.registerMember(registerMemberInput, user);
  }

  @Mutation((returns) => RegisterMemberOutput)
  @Role(['User'])
  editTeam(
    @Args('input') editTeamInput: EditTeamInput,
    @AuthUser() user: User,
  ): Promise<EditTeamOutput> {
    return this.teamService.editTeam(editTeamInput, user);
  }
}
