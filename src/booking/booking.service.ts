import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  BookingDetailInput,
  BookingDetailOutput,
} from './dto/booking-detail.dto';
import {
  CreateBookingInput,
  CreateBookingOutput,
} from './dto/create-booking.dto';
import {
  DeleteBookingInput,
  DeleteBookingOutput,
} from './dto/delete-booking.dto';
import { GetBookingsOutput } from './dto/get-bookings.dto';
import {
  RegisterParticipantInput,
  RegisterParticipantOutput,
} from './dto/register-participant.dto';
import { Booking } from './entity/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createBooking(
    createBookingInput: CreateBookingInput,
    representative: User,
  ): Promise<CreateBookingOutput> {
    try {
      const startEarly = await this.bookingRepo.findOne({
        place: createBookingInput.place,
        startAt: LessThan(createBookingInput.startAt),
        endAt: MoreThan(createBookingInput.startAt),
      });
      const startInTheMiddle1 = await this.bookingRepo.findOne({
        place: createBookingInput.place,
        startAt: MoreThan(createBookingInput.startAt),
      });
      const startInTheMiddle2 = await this.bookingRepo.findOne({
        place: createBookingInput.place,
        startAt: LessThan(createBookingInput.endAt),
      });
      if (startEarly || (startInTheMiddle1 && startInTheMiddle2)) {
        return {
          ok: false,
          error: 'Already booking exist',
        };
      }

      await this.bookingRepo.save(
        this.bookingRepo.create({
          representative,
          ...createBookingInput,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async bookingDetail({
    bookingId,
  }: BookingDetailInput): Promise<BookingDetailOutput> {
    try {
      const booking = await this.bookingRepo.findOne(bookingId, {
        relations: ['participants'],
      });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      return {
        ok: true,
        booking,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async getBookings(user: User): Promise<GetBookingsOutput> {
    try {
      const bookings = await this.bookingRepo.find({
        relations: ['participants'],
        where: {
          representative: user,
        },
        order: {
          startAt: 'ASC',
        },
      });

      if (!bookings) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      return {
        ok: true,
        bookings,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async registerParticipant(
    { participantId, bookingId }: RegisterParticipantInput,
    representative: User,
  ): Promise<RegisterParticipantOutput> {
    try {
      const booking = await this.bookingRepo.findOne(
        {
          id: bookingId,
        },
        { relations: ['participants'] },
      );
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.representativeId !== representative.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }
      const participant = await this.userRepo.findOne({ id: participantId });
      if (!participant) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      booking.participants.push(participant);
      await this.bookingRepo.save(booking);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async deleteBooking(
    { bookingId }: DeleteBookingInput,
    representative: User,
  ): Promise<DeleteBookingOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.representativeId !== representative.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }
      await this.bookingRepo.delete(bookingId);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
