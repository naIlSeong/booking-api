import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';

@InputType()
export class GetInProgressBookingInput {
  @Field((type) => Int, { nullable: true })
  placeId?: number;
}

@ObjectType()
export class GetInProgressBookingOutput extends CoreOutput {
  @Field((type) => [Booking], { nullable: true })
  bookings?: Booking[];
}
