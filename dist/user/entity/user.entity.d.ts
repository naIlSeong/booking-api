import { CoreEntity } from 'src/common/entity/common.entity';
import { Booking } from 'src/booking/entity/booking.entity';
import { Team } from 'src/team/entity/team.entity';
export declare enum UserRole {
    Admin = "Admin",
    Individual = "Individual",
    Representative = "Representative",
    Member = "Member"
}
export declare class User extends CoreEntity {
    studentId?: number;
    studentEmail?: string;
    username: string;
    usernameSlug: string;
    password: string;
    role: UserRole;
    bookings?: Booking[];
    CreatedBooking?: Booking[];
    team?: Team;
    teamId: number;
    writeEmail(): void;
    hashPassword(): Promise<void>;
    checkPassword(password: string): Promise<boolean>;
}
