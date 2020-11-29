import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
import { BookingService } from './booking.service';
import {
  CreateBookingInput,
  CreateBookingOutput,
} from './dto/create-booking.dto';
import { Booking } from './entity/booking.entity';

@Resolver((of) => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation((returns) => CreateBookingOutput)
  @Role(['User'])
  createBooking(
    @Args('input') createBookingInput: CreateBookingInput,
    @AuthUser() representative: User,
  ) {
    return this.bookingService.createBooking(
      createBookingInput,
      representative,
    );
  }
}
