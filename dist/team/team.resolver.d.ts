import { User } from 'src/user/entity/user.entity';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { DeleteTeamOutput } from './dto/delete-team.dto';
import { EditTeamInput, EditTeamOutput } from './dto/edit-team.dto';
import { GetTeamsOutput } from './dto/get-teams.dto';
import { LeaveTeamOutput } from './dto/leave-team.dto';
import { RegisterMemberInput, RegisterMemberOutput } from './dto/register-member.dto';
import { SearchTeamInput, SearchTeamOutput } from './dto/search-team.dto';
import { TeamDetailInput, TeamDetailOutput } from './dto/team-detail.dto';
import { TeamService } from './team.service';
export declare class TeamResolver {
    private readonly teamService;
    constructor(teamService: TeamService);
    createTeam(createTeamInput: CreateTeamInput, individual: User): Promise<CreateTeamOutput>;
    registerMember(registerMemberInput: RegisterMemberInput, individual: User): Promise<RegisterMemberOutput>;
    editTeam(editTeamInput: EditTeamInput, user: User): Promise<EditTeamOutput>;
    teamDetail(teamDetailInput: TeamDetailInput): Promise<TeamDetailOutput>;
    getTeams(): Promise<GetTeamsOutput>;
    deleteTeam(user: User): Promise<DeleteTeamOutput>;
    searchTeam(searchTeamInput: SearchTeamInput): Promise<SearchTeamOutput>;
    leaveTeam(member: User): Promise<LeaveTeamOutput>;
}
