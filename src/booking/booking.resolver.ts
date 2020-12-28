import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cron } from '@nestjs/schedule';
import { AuthUser } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/common.dto';
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
import { FinishInUseInput, FinishInUseOutput } from './dto/finish-in-use.dto';
import { GetBookingInput, GetBookingOutput } from './dto/get-booking.dto';
import { Booking } from './entity/booking.entity';

@Resolver((of) => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation((returns) => CreateBookingOutput)
  @Role(['User'])
  createBooking(
    @Args('input') createBookingInput: CreateBookingInput,
    @AuthUser() creator: User,
  ): Promise<CreateBookingOutput> {
    return this.bookingService.createBooking(createBookingInput, creator.id);
  }

  @Query((returns) => BookingDetailOutput)
  @Role(['Any'])
  bookingDetail(
    @Args('input') bookingDetailInput: BookingDetailInput,
  ): Promise<BookingDetailOutput> {
    return this.bookingService.bookingDetail(bookingDetailInput);
  }

  @Query((returns) => GetBookingOutput)
  @Role(['Any'])
  getBooking(
    @AuthUser() creator: User,
    @Args('input') getBookingInput: GetBookingInput,
  ): Promise<GetBookingOutput> {
    return this.bookingService.getBooking(creator.id, getBookingInput);
  }

  @Mutation((returns) => DeleteBookingOutput)
  @Role(['User'])
  deleteBooking(
    @Args('input') deleteBookingInput: DeleteBookingInput,
    @AuthUser() creator: User,
  ): Promise<DeleteBookingOutput> {
    return this.bookingService.deleteBooking(deleteBookingInput, creator.id);
  }

  @Mutation((returns) => EditBookingOutput)
  @Role(['User'])
  editBooking(
    @Args('input') editBookingInput: EditBookingInput,
    @AuthUser() creator: User,
  ): Promise<EditBookingOutput> {
    return this.bookingService.editBooking(editBookingInput, creator.id);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Admin'])
  editBookingForTest(
    @Args('bookingId') bookingId: number,
  ): Promise<CoreOutput> {
    return this.bookingService.editBookingForTest(bookingId);
  }

  @Mutation((returns) => CreateInUseOutput)
  @Role(['User'])
  createInUse(
    @Args('input') createInUseInput: CreateInUseInput,
    @AuthUser() creator: User,
  ): Promise<CreateInUseOutput> {
    return this.bookingService.createInUse(createInUseInput, creator.id);
  }

  @Cron('*/30 * * * * *')
  checkInUse() {
    return this.bookingService.checkInUse();
  }

  @Mutation((returns) => ExtendInUseOutput)
  @Role(['User'])
  extendInUse(
    @Args('input') extendInUseInput: ExtendInUseInput,
    @AuthUser() creator: User,
  ): Promise<ExtendInUseOutput> {
    return this.bookingService.extendInUse(extendInUseInput, creator.id);
  }

  @Mutation((returns) => FinishInUseOutput)
  @Role(['User'])
  finishInUse(
    @Args('input') finishInUseInput: FinishInUseInput,
    @AuthUser() creator: User,
  ): Promise<FinishInUseOutput> {
    return this.bookingService.finishInUse(finishInUseInput, creator.id);
  }
}
