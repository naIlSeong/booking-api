import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { User } from 'src/user/entity/user.entity';
import { Place } from '../place/entity/place.entity';
import { Team } from 'src/team/entity/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Place, Team])],
  providers: [BookingService, BookingResolver],
})
export class BookingModule {}
