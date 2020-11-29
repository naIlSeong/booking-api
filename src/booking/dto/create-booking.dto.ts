import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Booking } from '../entity/booking.entity';

@InputType()
export class CreateBookingInput extends PickType(Booking, [
  'place',
  'startAt',
  'endAt',
]) {
  @Field((type) => String, { nullable: true })
  teamName?: string;
}

@ObjectType()
export class CreateBookingOutput extends CoreOutput {}
