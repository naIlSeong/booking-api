import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';
export declare class BookingDetailInput {
    bookingId: number;
}
export declare class BookingDetailOutput extends CoreOutput {
    booking?: Booking;
}
