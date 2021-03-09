import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';
export declare class GetBookingInput {
    placeId?: number;
    isInProgress?: boolean;
    isComingUp?: boolean;
    isFinished?: boolean;
}
export declare class GetBookingOutput extends CoreOutput {
    bookings?: Booking[];
}
