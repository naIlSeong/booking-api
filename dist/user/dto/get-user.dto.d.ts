import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';
export declare class GetUserInput {
    userId: number;
}
export declare class GetUserOutput extends CoreOutput {
    user?: User;
}
