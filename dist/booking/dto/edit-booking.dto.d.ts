import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';
declare const EditBookingInput_base: import("@nestjs/common").Type<Partial<Pick<Booking, "id" | "createdAt" | "updatedAt" | "inUse" | "place" | "team" | "creator" | "creatorId" | "startAt" | "endAt" | "isFinished" | "canExtend" | "checkDate">>>;
export declare class EditBookingInput extends EditBookingInput_base {
    bookingId: number;
    placeId?: number;
    withTeam: boolean;
}
export declare class EditBookingOutput extends CoreOutput {
}
export {};
