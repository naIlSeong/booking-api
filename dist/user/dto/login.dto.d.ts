import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';
declare const LoginInput_base: import("@nestjs/common").Type<Pick<User, "username" | "password">>;
export declare class LoginInput extends LoginInput_base {
}
export declare class LoginOutput extends CoreOutput {
    token?: string;
}
export {};
