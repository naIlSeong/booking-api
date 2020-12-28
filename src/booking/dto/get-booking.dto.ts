import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';

@InputType()
export class GetBookingInput {
  @Field((type) => Int, { nullable: true })
  placeId?: number;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  isInProgress?: boolean;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  isComingUp?: boolean;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  isFinished?: boolean;
}

@ObjectType()
export class GetBookingOutput extends CoreOutput {
  @Field((type) => [Booking], { nullable: true })
  bookings?: Booking[];
}
