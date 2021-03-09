import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';
declare const CreateBookingInput_base: import("@nestjs/common").Type<Pick<Booking, "startAt" | "endAt">>;
export declare class CreateBookingInput extends CreateBookingInput_base {
    placeId: number;
    withTeam?: boolean;
}
export declare class CreateBookingOutput extends CoreOutput {
}
export {};
