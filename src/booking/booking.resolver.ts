import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { GetBookingsOutput } from './dto/get-bookings.dto';
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
}
