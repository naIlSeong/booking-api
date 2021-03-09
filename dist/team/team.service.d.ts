import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamInput, CreateTeamOutput } from './dto/create-team.dto';
import { DeleteTeamOutput } from './dto/delete-team.dto';
import { EditTeamInput, EditTeamOutput } from './dto/edit-team.dto';
import { GetTeamsOutput } from './dto/get-teams.dto';
import { LeaveTeamOutput } from './dto/leave-team.dto';
import { RegisterMemberInput, RegisterMemberOutput } from './dto/register-member.dto';
import { SearchTeamInput, SearchTeamOutput } from './dto/search-team.dto';
import { TeamDetailInput, TeamDetailOutput } from './dto/team-detail.dto';
import { Team } from './entity/team.entity';
export declare class TeamService {
    private readonly teamRepo;
    private readonly userRepo;
    constructor(teamRepo: Repository<Team>, userRepo: Repository<User>);
    private generateSlug;
    createTeam({ teamName }: CreateTeamInput, individualId: number): Promise<CreateTeamOutput>;
    registerMember({ teamId }: RegisterMemberInput, representativeId: number): Promise<RegisterMemberOutput>;
    editTeam({ teamName }: EditTeamInput, representativeId: number): Promise<EditTeamOutput>;
    teamDetail({ teamId }: TeamDetailInput): Promise<TeamDetailOutput>;
    getTeams(): Promise<GetTeamsOutput>;
    deleteTeam(representativeId: number): Promise<DeleteTeamOutput>;
    searchTeam({ query }: SearchTeamInput): Promise<SearchTeamOutput>;
    leaveTeam(memberId: number): Promise<LeaveTeamOutput>;
}
