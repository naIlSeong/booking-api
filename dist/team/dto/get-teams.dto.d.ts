import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';
export declare class GetTeamsOutput extends CoreOutput {
    teams?: Team[];
}
