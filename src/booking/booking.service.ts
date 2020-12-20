import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/common.dto';
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

      // ToDo : Add Error if !teamId
      if (
        createBookingInput.withTeam &&
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
        relations: ['place', 'team'],
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

  // ToDo : Add getBookingsByPlaceId

  // Fix It
  // Change user -> creatorId
  // Change name : getMyBookings
  async getBookings(creatorId: number): Promise<GetBookingsOutput> {
    try {
      const bookings = await this.bookingRepo.find({
        relations: ['place', 'team'],
        where: {
          creatorId,
        },
        order: {
          startAt: 'ASC',
        },
      });
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

  // ToDo : withTeam Change
  async editBooking(
    { startAt, endAt, bookingId, placeId }: EditBookingInput,
    creatorId: number,
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
      if (booking.creatorId !== creatorId) {
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

      let place = booking.place;
      // 장소 변경
      if (placeId) {
        place = await this.placeRepo.findOne({ id: placeId });
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
        booking.place = place;
      }

      // 장소만 변경, 시간은 변경 X
      if (placeId && !startAt && !endAt) {
        startAt = booking.startAt;
        endAt = booking.endAt;
      }

      // 시간 변경 or 스케줄 체크
      if (startAt && endAt) {
        // check startAt & endAt
        const { startEarlyOrEqual, startInMiddle } = await this.checkSchedule(
          place,
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
    creatorId: number,
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
        creatorId,
        inUse: true,
      });

      if (withTeam && withTeam === true) {
        const creator = await this.userRepo.findOne({ id: creatorId });
        if (!creator.teamId) {
          return {
            ok: false,
            error: 'Team not found',
          };
        }
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
    creatorId: number,
  ): Promise<ExtendInUseOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.creatorId !== creatorId) {
        return {
          ok: false,
          error: "You can't do this",
        };
      }
      if (booking.isFinished === true) {
        return {
          ok: false,
          error: 'Already finished',
        };
      }
      if (booking.inUse === false) {
        return {
          ok: false,
          error: 'Not in use',
        };
      }
      const now: Date = new Date();
      // 10m
      if (booking.endAt.valueOf() - now.valueOf() > 600000) {
        return {
          ok: false,
          error: "Can't extend now",
        };
      }

      // 30m
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

  // Change creator -> creatorId
  async finishInUse(
    { bookingId }: FinishInUseInput,
    creatorId: number,
  ): Promise<FinishInUseOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      if (!booking) {
        return {
          ok: false,
          error: 'Booking not found',
        };
      }
      if (booking.creatorId !== creatorId) {
        return {
          ok: false,
          error: "You can't to this",
        };
      }
      if (booking.isFinished === true) {
        return {
          ok: false,
          error: 'Already finished',
        };
      }
      if (booking.inUse === false) {
        return {
          ok: false,
          error: 'Not in use',
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

  async editBookingForTest(bookingId: number): Promise<CoreOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      booking.startAt = new Date(booking.startAt.valueOf() - 3300000);
      booking.endAt = new Date(booking.endAt.valueOf() - 3300000);
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
