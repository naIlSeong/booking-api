import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';
export declare class TeamDetailInput {
    teamId: number;
}
export declare class TeamDetailOutput extends CoreOutput {
    team?: Team;
}
