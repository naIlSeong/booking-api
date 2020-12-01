import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';

@InputType()
export class EditBookingInput extends PartialType(
  PickType(Booking, ['teamName', 'startAt', 'endAt']),
) {
  @Field((type) => Int)
  bookingId?: number;

  @Field((type) => Int, { nullable: true })
  placeId?: number;

  @Field((type) => Int, { nullable: true })
  userId?: number;
}

@ObjectType()
export class EditBookingOutput extends CoreOutput {}
