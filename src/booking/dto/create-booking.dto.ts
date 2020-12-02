import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';

@InputType()
export class CreateBookingInput extends PickType(Booking, [
  'startAt',
  'endAt',
]) {
  @Field((type) => Int)
  placeId: number;

  @Field((type) => Boolean, { defaultValue: false })
  withTeam: boolean;
}

@ObjectType()
export class CreateBookingOutput extends CoreOutput {}
