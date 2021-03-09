import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from 'src/user/entity/user.entity';
import { BookingService } from './booking.service';
import { BookingDetailInput, BookingDetailOutput } from './dto/booking-detail.dto';
import { CreateBookingInput, CreateBookingOutput } from './dto/create-booking.dto';
import { CreateInUseInput, CreateInUseOutput } from './dto/create-in-use.dto';
import { DeleteBookingInput, DeleteBookingOutput } from './dto/delete-booking.dto';
import { EditBookingInput, EditBookingOutput } from './dto/edit-booking.dto';
import { ExtendInUseInput, ExtendInUseOutput } from './dto/extend-in-use.dto';
import { FinishInUseInput, FinishInUseOutput } from './dto/finish-in-use.dto';
import { GetBookingInput, GetBookingOutput } from './dto/get-booking.dto';
export declare class BookingResolver {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(createBookingInput: CreateBookingInput, creator: User): Promise<CreateBookingOutput>;
    bookingDetail(bookingDetailInput: BookingDetailInput): Promise<BookingDetailOutput>;
    getBooking(creator: User, getBookingInput: GetBookingInput): Promise<GetBookingOutput>;
    deleteBooking(deleteBookingInput: DeleteBookingInput, creator: User): Promise<DeleteBookingOutput>;
    editBooking(editBookingInput: EditBookingInput, creator: User): Promise<EditBookingOutput>;
    editBookingForTest(bookingId: number): Promise<CoreOutput>;
    createInUse(createInUseInput: CreateInUseInput, creator: User): Promise<CreateInUseOutput>;
    checkInUse(): Promise<void>;
    extendInUse(extendInUseInput: ExtendInUseInput, creator: User): Promise<ExtendInUseOutput>;
    finishInUse(finishInUseInput: FinishInUseInput, creator: User): Promise<FinishInUseOutput>;
}
