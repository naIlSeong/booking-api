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
import {
  GetComingUpBookingInput,
  GetComingUpBookingOutput,
} from './dto/get-coming-up-booking.dto';
import {
  GetInProgressBookingInput,
  GetInProgressBookingOutput,
} from './dto/get-in-progress-booking.dto';
import { GetMyBookingsOutput } from './dto/get-my-bookings.dto';
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

  private async isCreatableBooking(
    place: Place,
    startAt: Date,
    endAt: Date,
    isEdit: boolean,
    bookingId?: number,
  ): Promise<string> {
    const startFirst = await this.bookingRepo.find({
      place,
      startAt: LessThanOrEqual(startAt),
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
    const error = 'Already booking exist';
    if (startFirst.length !== 0 || startLater.length !== 0) {
      if (!isEdit) {
        return error;
      }
      if (
        (startFirst.length === 1 &&
          startFirst[0].id === bookingId &&
          startLater.length === 0) ||
        (startFirst.length === 0 &&
          startLater.length === 1 &&
          startLater[0].id === bookingId) === false
      ) {
        return error;
      }
    }
    return;
  }

  private async isAvailablePlace(
    placeId: number,
  ): Promise<{ error?: string; place?: Place }> {
    const place = await this.placeRepo.findOne({
      id: placeId,
    });
    if (!place) {
      return { error: 'Place not found' };
    }
    if (place.isAvailable === false) {
      return { error: 'Place not available' };
    }
    return { place };
  }

  private isCreatorsBooking(
    booking: Booking,
    creatorId: number,
    checkState: boolean,
  ): string {
    if (!booking) {
      return 'Booking not found';
    }
    if (booking.creatorId !== creatorId) {
      return "You can't do this";
    }
    if (checkState) {
      if (booking.isFinished === true) {
        return 'Already finished';
      }
      if (booking.inUse === false) {
        return 'Not in use';
      }
    }
    return;
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

      const canExtendBooking = await this.bookingRepo.find({
        inUse: true,
        isFinished: false,
      });
      canExtendBooking.forEach(async (booking) => {
        if (booking.endAt.valueOf() - now.valueOf() <= 600000) {
          booking.canExtend = true;
          await this.bookingRepo.save(booking);
        } else {
          booking.canExtend = false;
          await this.bookingRepo.save(booking);
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

  async createBooking(
    { startAt, endAt, placeId, withTeam }: CreateBookingInput,
    creatorId: number,
  ): Promise<CreateBookingOutput> {
    try {
      const { error, place } = await this.isAvailablePlace(placeId);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      const newError = await this.isCreatableBooking(
        place,
        startAt,
        endAt,
        false,
      );
      if (newError) {
        return {
          ok: false,
          error: newError,
        };
      }
      const booking = this.bookingRepo.create({
        creatorId,
        place,
        startAt,
        endAt,
      });

      // ToDo : Add Error if !teamId
      const creator = await this.userRepo.findOne({ id: creatorId });
      if (withTeam && withTeam === true) {
        if (!creator.teamId || creator.role === UserRole.Individual) {
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
      const creator = await this.userRepo.findOne({ id: booking.creatorId });
      return {
        ok: true,
        booking,
        creator,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Unexpected Error',
      };
    }
  }

  async getInProgressBooking(
    creatorId: number,
    { placeId }: GetInProgressBookingInput,
  ): Promise<GetInProgressBookingOutput> {
    try {
      if (!placeId) {
        const bookings = await this.bookingRepo.find({
          relations: ['place', 'team'],
          where: {
            creatorId,
            isFinished: false,
            inUse: true,
          },
          order: {
            startAt: 'ASC',
          },
        });
        return {
          ok: true,
          bookings,
        };
      }
      const place = await this.placeRepo.findOne({
        id: placeId,
      });
      const bookings = await this.bookingRepo.find({
        relations: ['place', 'team'],
        where: {
          place,
          isFinished: false,
          inUse: true,
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

  async getComingUpBooking(
    creatorId: number,
    { placeId }: GetComingUpBookingInput,
  ): Promise<GetComingUpBookingOutput> {
    try {
      if (!placeId) {
        const bookings = await this.bookingRepo.find({
          relations: ['place', 'team'],
          where: {
            creatorId,
            isFinished: false,
            inUse: false,
          },
          order: {
            startAt: 'ASC',
          },
        });
        return {
          ok: true,
          bookings,
        };
      }
      const place = await this.placeRepo.findOne({
        id: placeId,
      });
      const bookings = await this.bookingRepo.find({
        relations: ['place', 'team'],
        where: {
          place,
          isFinished: false,
          inUse: false,
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

  async getFinishedBooking(creatorId: number): Promise<GetMyBookingsOutput> {
    try {
      const bookings = await this.bookingRepo.find({
        relations: ['place', 'team'],
        where: {
          creatorId,
          isFinished: true,
          inUse: false,
        },
        order: {
          startAt: 'DESC',
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

  async deleteBooking(
    { bookingId }: DeleteBookingInput,
    creatorId: number,
  ): Promise<DeleteBookingOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      const error = this.isCreatorsBooking(booking, creatorId, false);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      await this.bookingRepo.delete(bookingId);
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
      let error: string;
      error = this.isCreatorsBooking(booking, creatorId, false);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      if (booking.inUse === true) {
        return {
          ok: false,
          error: "You can't do this in use",
        };
      }

      if (placeId) {
        const { error, place } = await this.isAvailablePlace(placeId);
        if (error) {
          return {
            ok: false,
            error,
          };
        }
        booking.place = place;
      }
      const place = booking.place;
      if (!startAt && !endAt) {
        startAt = booking.startAt;
        endAt = booking.endAt;
      }

      error = await this.isCreatableBooking(
        place,
        startAt,
        endAt,
        true,
        bookingId,
      );
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      await this.bookingRepo.save({ ...booking, startAt, endAt });
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
      const { error, place } = await this.isAvailablePlace(placeId);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      const startAt: Date = new Date();
      const endAt: Date = new Date(startAt.getTime() + 3600000);

      const newError = await this.isCreatableBooking(
        place,
        startAt,
        endAt,
        false,
      );
      if (newError) {
        return {
          ok: false,
          error: newError,
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
        booking.team = await this.teamRepo.findOne({ id: creator.teamId });
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

  async extendInUse(
    { bookingId }: ExtendInUseInput,
    creatorId: number,
  ): Promise<ExtendInUseOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      const error = this.isCreatorsBooking(booking, creatorId, true);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      const now: Date = new Date();
      if (
        booking.endAt.valueOf() - now.valueOf() > 600000 &&
        booking.canExtend === false
      ) {
        return {
          ok: false,
          error: "Can't extend now",
        };
      }

      await this.bookingRepo.save({
        ...booking,
        endAt: new Date(booking.endAt.getTime() + 1800000),
        canExtend: false,
      });
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
    creatorId: number,
  ): Promise<FinishInUseOutput> {
    try {
      const booking = await this.bookingRepo.findOne({ id: bookingId });
      const error = this.isCreatorsBooking(booking, creatorId, true);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      await this.bookingRepo.save({
        ...booking,
        inUse: false,
        isFinished: true,
        endAt: new Date(),
      });
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
