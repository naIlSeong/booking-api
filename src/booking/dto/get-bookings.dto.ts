import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';

@ObjectType()
export class GetBookingsOutput extends CoreOutput {
  @Field((type) => [Booking], { nullable: true })
  bookings?: Booking[];
}
