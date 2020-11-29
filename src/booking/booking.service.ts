import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  CreateBookingInput,
  CreateBookingOutput,
} from './dto/create-booking.dto';
import { Booking } from './entity/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async createBooking(
    createBookingInput: CreateBookingInput,
    representative: User,
  ): Promise<CreateBookingOutput> {
    try {
      const exist1 = await this.bookingRepo.findOne({
        place: createBookingInput.place,
        endAt: MoreThan(createBookingInput.startAt),
      });
      const exist2 = await this.bookingRepo.findOne({
        place: createBookingInput.place,
        startAt: LessThan(createBookingInput.endAt),
      });

      if (exist1 && exist2) {
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
        error: 'Unexpected Error',
      };
    }
  }
}
