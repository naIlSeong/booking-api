import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';
declare const CreateUserInput_base: import("@nestjs/common").Type<Partial<Pick<User, "id" | "createdAt" | "updatedAt" | "bookings" | "team" | "studentId" | "studentEmail" | "username" | "usernameSlug" | "password" | "role" | "CreatedBooking" | "teamId" | "writeEmail" | "hashPassword" | "checkPassword">>>;
export declare class CreateUserInput extends CreateUserInput_base {
}
export declare class CreateUserOutput extends CoreOutput {
}
export {};
