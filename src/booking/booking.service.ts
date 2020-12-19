import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/place/entity/place.entity';
import { Team } from 'src/team/entity/team.entity';
import { User, UserRole } from 'src/user/entity/user.entity';
import { LessThan, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
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
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async checkSchedule(place: Place, startAt: Date, endAt: Date) {
    const startEarlyOrEqual = await this.bookingRepo.find({
      place,
      startAt: LessThanOrEqual(startAt),
      endAt: MoreThan(startAt),
    });
    const startInMiddle1 = await this.bookingRepo.find({
      place,
      startAt: MoreThan(startAt),
    });
    const startInMiddle2 = await this.bookingRepo.find({
      place,
      startAt: LessThan(endAt),
    });
    const startInMiddle: Booking[] = [];
    startInMiddle1.forEach((a) =>
      startInMiddle2.forEach((b) => {
        if (a.id === b.id) {
          startInMiddle.push(a);
        }
      }),
    );
    return { startEarlyOrEqual, startInMiddle };
  }

  isMyBooking(
    bookingId: number,
    startEarlyOrEqual: Booking[],
    startInMiddle: Booking[],
  ): boolean {
    if (
      (startEarlyOrEqual.length === 1 &&
        startEarlyOrEqual[0].id === bookingId &&
        startInMiddle.length === 0) ||
      (startEarlyOrEqual.length === 0 &&
        startInMiddle.length === 1 &&
        startInMiddle[0].id === bookingId)
    ) {
      return true;
    } else {
      return false;
    }
  }

  async createBooking(
    createBookingInput: CreateBookingInput,
    creatorId: number,
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
      const { startEarlyOrEqual, startInMiddle } = await this.checkSchedule(
        place,
        createBookingInput.startAt,
        createBookingInput.endAt,
      );
      const existBooking =
        startEarlyOrEqual.length !== 0 || startInMiddle.length !== 0;
      if (existBooking) {
        return {
          ok: false,
          error: 'Already booking exist',
        };
      }

      const booking = this.bookingRepo.create({
        creatorId: creatorId,
        place,
        ...createBookingInput,
      });
      const creator = await this.userRepo.findOne({ id: creatorId });

      if (
        createBookingInput.withTeam === true &&
        creator.teamId &&
        creator.role !== UserRole.Individual
      ) {
        const team = await this.teamRepo.findOne({ id: creator.teamId });
        booking.team = team;
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

  async bookingDetail({
    bookingId,
  }: BookingDetailInput): Promise<BookingDetailOutput> {
    try {
      const booking = await this.bookingRepo.findOne(bookingId, {
        relations: ['creator', 'place', 'team'],
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
        relations: ['place', 'team'],
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

  // async registerParticipant(
  //   { participantId, bookingId }: RegisterParticipantInput,
  //   creator: User,
  // ): Promise<RegisterParticipantOutput> {
  //   try {
  //     const booking = await this.bookingRepo.findOne(
  //       {
  //         id: bookingId,
  //       },
  //       { relations: ['creator', 'participants'] },
  //     );
  //     if (!booking) {
  //       return {
  //         ok: false,
  //         error: 'Booking not found',
  //       };
  //     }
  //     if (booking.creator.id !== creator.id) {
  //       return {
  //         ok: false,
  //         error: "You can't do this",
  //       };
  //     }
  //     if (booking.inUse === true) {
  //       return {
  //         ok: false,
  //         error: "You can't do this in use",
  //       };
  //     }
  //     const participant = await this.userRepo.findOne({ id: participantId });
  //     if (!participant) {
  //       return {
  //         ok: false,
  //         error: 'User not found',
  //       };
  //     }
  //     booking.participants.push(participant);
  //     await this.bookingRepo.save(booking);
  //     return {
  //       ok: true,
  //     };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error: 'Unexpected Error',
  //     };
  //   }
  // }

  async deleteBooking(
    { bookingId }: DeleteBookingInput,
    creator: User,
  ): Promise<DeleteBookingOutput> {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { id: bookingId },
        relations: ['creator'],
      });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.creatorId !== creator.id) {
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
    { startAt, endAt, bookingId, placeId, userId, teamId }: EditBookingInput,
    creator: User,
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
      if (booking.creatorId !== creator.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }
      if (booking.inUse === true) {
        return {
          ok: false,
          error: "You can't do this in use",
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
        const { startEarlyOrEqual, startInMiddle } = await this.checkSchedule(
          booking.place,
          startAt,
          endAt,
        );
        if (startEarlyOrEqual.length !== 0 || startInMiddle.length !== 0) {
          if (
            this.isMyBooking(bookingId, startEarlyOrEqual, startInMiddle) ===
            false
          ) {
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
        const { startEarlyOrEqual, startInMiddle } = await this.checkSchedule(
          booking.place,
          startAt,
          endAt,
        );
        if (startEarlyOrEqual.length !== 0 || startInMiddle.length !== 0) {
          if (
            this.isMyBooking(bookingId, startEarlyOrEqual, startInMiddle) ===
            false
          ) {
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
      // if (userId) {
      //   const newRepresentative = await this.userRepo.findOne({ id: userId });
      //   if (!newRepresentative) {
      //     return {
      //       ok: false,
      //       error: 'User not found',
      //     };
      //   }
      //   // ToDo : Only member can be new creator
      //   booking.creator = newRepresentative;
      // }

      // if (teamId) {
      //   const team = await this.teamRepo.findOne({ id: teamId });
      //   if (!team) {
      //     return {
      //       ok: false,
      //       error: 'Team not found',
      //     };
      //   }
      //   booking.team = team;
      // }

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

  async createInUse(
    { placeId, withTeam }: CreateInUseInput,
    creator: User,
  ): Promise<CreateInUseOutput> {
    try {
      const place = await this.placeRepo.findOne({ id: placeId });
      if (!place) {
        return {
          ok: false,
          error: 'Place not found',
        };
      }
      if (!place.isAvailable) {
        return {
          ok: false,
          error: 'Place not available',
        };
      }

      const startAt: Date = new Date();
      const endAt: Date = new Date(startAt.getTime() + 3600000);

      const { startEarlyOrEqual, startInMiddle } = await this.checkSchedule(
        place,
        startAt,
        endAt,
      );
      if (startEarlyOrEqual.length !== 0 || startInMiddle.length !== 0) {
        return {
          ok: false,
          error: 'Already booking exist',
        };
      }

      const booking = this.bookingRepo.create({
        startAt,
        endAt,
        place,
        creatorId: creator.id,
        inUse: true,
      });

      if (withTeam === true) {
        const team = await this.teamRepo.findOne({ id: creator.teamId });
        if (!team) {
          return {
            ok: false,
            error: 'Team not found',
          };
        }
        booking.team = team;
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

  async checkInUse(): Promise<void> {
    try {
      const now = new Date();
      const nowInUse = await this.bookingRepo.find({
        startAt: LessThan(now),
        endAt: MoreThan(now),
      });
      nowInUse.forEach(async (booking) => {
        if (booking.inUse === false) {
          if (booking.isFinished === false) {
            booking.inUse = true;
            await this.bookingRepo.save(booking);
          }
        }
      });

      const finishedInUse = await this.bookingRepo.find({
        endAt: LessThan(now),
        isFinished: false,
      });
      finishedInUse.forEach(async (booking) => {
        if (booking.inUse === true) {
          booking.inUse = false;
        }
        if (booking.isFinished === false) {
          booking.isFinished = true;
        }
        await this.bookingRepo.save(booking);
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async extendInUse(
    { bookingId }: ExtendInUseInput,
    creator: User,
  ): Promise<ExtendInUseOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.creatorId !== creator.id) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }
      if (booking.inUse === false) {
        return {
          ok: false,
          error: 'Not in use',
        };
      }
      if (booking.isFinished === true) {
        return {
          ok: false,
          error: 'Already finished',
        };
      }
      const now: Date = new Date();
      if (booking.endAt.valueOf() - now.valueOf() > 600000) {
        return {
          ok: false,
          error: "Can't extend now",
        };
      }

      booking.endAt = new Date(booking.endAt.getTime() + 1800000);
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

  async finishInUse(
    { bookingId }: FinishInUseInput,
    creator: User,
  ): Promise<FinishInUseOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.creatorId !== creator.id) {
        return {
          ok: false,
          error: "You can't to this",
        };
      }
      if (booking.inUse === false) {
        return {
          ok: false,
          error: 'Not in use',
        };
      }
      if (booking.isFinished === true) {
        return {
          ok: false,
          error: 'Already finished',
        };
      }

      booking.inUse = false;
      booking.isFinished = true;
      booking.endAt = new Date();
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
