import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';
declare const EditTeamInput_base: import("@nestjs/common").Type<Pick<Team, "teamName">>;
export declare class EditTeamInput extends EditTeamInput_base {
}
export declare class EditTeamOutput extends CoreOutput {
}
export {};
