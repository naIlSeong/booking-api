import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cron } from '@nestjs/schedule';
import { AuthUser } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
import { BookingService } from './booking.service';
import {
  BookingDetailInput,
  BookingDetailOutput,
} from './dto/booking-detail.dto';
import {
  CreateBookingInput,
  CreateBookingOutput,
} from './dto/create-booking.dto';
import { CreateInUseInput, CreateInUseOutput } from './dto/create-in-use.dto';
import {
  DeleteBookingInput,
  DeleteBookingOutput,
} from './dto/delete-booking.dto';
import { EditBookingInput, EditBookingOutput } from './dto/edit-booking.dto';
import { ExtendInUseInput, ExtendInUseOutput } from './dto/extend-in-use.dto';
import { GetBookingsOutput } from './dto/get-bookings.dto';
import {
  RegisterParticipantInput,
  RegisterParticipantOutput,
} from './dto/register-participant.dto';
import { Booking } from './entity/booking.entity';

@Resolver((of) => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation((returns) => CreateBookingOutput)
  @Role(['User'])
  createBooking(
    @Args('input') createBookingInput: CreateBookingInput,
    @AuthUser() representative: User,
  ): Promise<CreateBookingOutput> {
    return this.bookingService.createBooking(
      createBookingInput,
      representative,
    );
  }

  @Query((returns) => BookingDetailOutput)
  @Role(['User'])
  bookingDetail(
    @Args('input') bookingDetailInput: BookingDetailInput,
  ): Promise<BookingDetailOutput> {
    return this.bookingService.bookingDetail(bookingDetailInput);
  }

  @Query((returns) => GetBookingsOutput)
  @Role(['User'])
  getBookings(@AuthUser() user: User): Promise<GetBookingsOutput> {
    return this.bookingService.getBookings(user);
  }

  @Mutation((returns) => RegisterParticipantOutput)
  @Role(['User'])
  registerParticipant(
    @Args('input') registerParticipantInput: RegisterParticipantInput,
    @AuthUser() representative: User,
  ): Promise<RegisterParticipantOutput> {
    return this.bookingService.registerParticipant(
      registerParticipantInput,
      representative,
    );
  }

  @Mutation((returns) => DeleteBookingOutput)
  @Role(['User'])
  deleteBooking(
    @Args('input') deleteBookingInput: DeleteBookingInput,
    @AuthUser() representative: User,
  ): Promise<DeleteBookingOutput> {
    return this.bookingService.deleteBooking(
      deleteBookingInput,
      representative,
    );
  }

  @Mutation((returns) => EditBookingOutput)
  @Role(['User'])
  editBooking(
    @Args('input') editBookingInput: EditBookingInput,
    @AuthUser() representative: User,
  ): Promise<EditBookingOutput> {
    return this.bookingService.editBooking(editBookingInput, representative);
  }

  @Mutation((returns) => CreateInUseOutput)
  @Role(['User'])
  createInUse(
    @Args('input') createInUseInput: CreateInUseInput,
    @AuthUser() user: User,
  ): Promise<CreateInUseOutput> {
    return this.bookingService.createInUse(createInUseInput, user);
  }

  @Cron('0 */10 * * * *')
  checkInUse() {
    return this.bookingService.checkInUse();
  }

  @Mutation((returns) => ExtendInUseOutput)
  @Role(['User'])
  extendInUse(
    @Args('input') extendInUseInput: ExtendInUseInput,
    @AuthUser() representative: User,
  ): Promise<ExtendInUseOutput> {
    return this.bookingService.extendInUse(extendInUseInput, representative);
  }
}
