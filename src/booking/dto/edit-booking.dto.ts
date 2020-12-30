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
  PickType(Booking, ['startAt', 'endAt']),
) {
  @Field((type) => Int)
  bookingId: number;

  @Field((type) => Int, { nullable: true })
  placeId?: number;

  @Field((type) => Boolean)
  withTeam: boolean;
}

@ObjectType()
export class EditBookingOutput extends CoreOutput {}
