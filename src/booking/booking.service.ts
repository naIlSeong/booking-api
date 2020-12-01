import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/place/entity/place.entity';
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
import { EditBookingInput, EditBookingOutput } from './dto/edit-booking.dto';
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
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
  ) {}

  async checkSchedule(place: Place, startAt: Date, endAt: Date) {
    const startEarly = await this.bookingRepo.find({
      place,
      startAt: LessThan(startAt),
      endAt: MoreThan(startAt),
    });
    const startLater1 = await this.bookingRepo.find({
      place,
      startAt: MoreThan(startAt),
    });
    const startLater2 = await this.bookingRepo.find({
      place,
      startAt: LessThan(endAt),
    });
    const startLater: Booking[] = [];
    startLater1.forEach((a) =>
      startLater2.forEach((b) => {
        if (a.id === b.id) {
          startLater.push(a);
        }
      }),
    );
    return { startEarly, startLater };
  }

  isMyBooking(
    bookingId: number,
    startEarly: Booking[],
    startLater: Booking[],
  ): boolean {
    if (
      (startEarly.length === 1 &&
        startEarly[0].id === bookingId &&
        startLater.length === 0) ||
      (startEarly.length === 0 &&
        startLater.length === 1 &&
        startLater[0].id === bookingId)
    ) {
      return true;
    } else {
      return false;
    }
  }

  async createBooking(
    createBookingInput: CreateBookingInput,
    representative: User,
  ): Promise<CreateBookingOutput> {
    try {
      const place = await this.placeRepo.findOne({
        id: createBookingInput.placeId,
      });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      if (place.isAvailable === false) {
        return {
          ok: false,
          error: 'Place not available',
        };
      }
      const { startEarly, startLater } = await this.checkSchedule(
        place,
        createBookingInput.startAt,
        createBookingInput.endAt,
      );
      const existBooking = startEarly.length !== 0 || startLater.length !== 0;
      if (existBooking) {
        return {
          ok: false,
          error: 'Already booking exist',
        };
      }

      await this.bookingRepo.save(
        this.bookingRepo.create({
          representative,
          place,
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
        relations: ['participants', 'place'],
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
        relations: ['place'],
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

  async editBooking(
    { teamName, startAt, endAt, bookingId, placeId, userId }: EditBookingInput,
    representative: User,
  ): Promise<EditBookingOutput> {
    try {
      const booking = await this.bookingRepo.findOne({
        where: {
          id: bookingId,
        },
        relations: ['place'],
      });
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

      // 장소 변경
      if (placeId) {
        const place = await this.placeRepo.findOne({ id: placeId });
        if (!place) {
          return {
            ok: false,
            error: 'Place not found',
          };
        }
        if (place.isAvailable === false) {
          return {
            ok: false,
            error: 'Place not available',
          };
        }
        // check startAt & endAt
        if (!startAt && !endAt) {
          startAt = booking.startAt;
          endAt = booking.endAt;
        }
        const { startEarly, startLater } = await this.checkSchedule(
          booking.place,
          startAt,
          endAt,
        );
        if (startEarly.length !== 0 || startLater.length !== 0) {
          if (this.isMyBooking(bookingId, startEarly, startLater) === false) {
            return {
              ok: false,
              error: 'Already booking exist',
            };
          }
        }
        booking.startAt = startAt;
        booking.endAt = endAt;
        booking.place = place;
      }

      // 시간 변경
      if (startAt && endAt) {
        // check startAt & endAt
        const { startEarly, startLater } = await this.checkSchedule(
          booking.place,
          startAt,
          endAt,
        );
        if (startEarly.length !== 0 || startLater.length !== 0) {
          if (this.isMyBooking(bookingId, startEarly, startLater) === false) {
            return {
              ok: false,
              error: 'Already booking exist',
            };
          }
        }
        booking.startAt = startAt;
        booking.endAt = endAt;
      }

      // representative 변경
      if (userId) {
        const newRepresentative = await this.userRepo.findOne({ id: userId });
        if (!newRepresentative) {
          return {
            ok: false,
            error: 'User not found',
          };
        }
        booking.representative = newRepresentative;
      }

      if (teamName) {
        booking.teamName = teamName;
      }

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
}
