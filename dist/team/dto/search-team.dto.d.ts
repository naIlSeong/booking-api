import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';
export declare class SearchTeamInput {
    query: string;
}
export declare class SearchTeamOutput extends CoreOutput {
    teams?: Team[];
}
