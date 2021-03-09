import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';
export declare class SearchUserInput {
    query: string;
}
export declare class SearchUserOutput extends CoreOutput {
    users?: User[];
}
