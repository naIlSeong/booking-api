import { Booking } from 'src/booking/entity/booking.entity';
import { CoreEntity } from 'src/common/entity/common.entity';
import { User } from 'src/user/entity/user.entity';
export declare class Team extends CoreEntity {
    teamName: string;
    teamNameSlug: string;
    members: User[];
    bookings?: Booking[];
}
