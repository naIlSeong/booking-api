import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';
declare const CreateTeamInput_base: import("@nestjs/common").Type<Pick<Team, "teamName">>;
export declare class CreateTeamInput extends CreateTeamInput_base {
}
export declare class CreateTeamOutput extends CoreOutput {
}
export {};
