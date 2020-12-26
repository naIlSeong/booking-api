import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from 'src/user/entity/user.entity';
import { Booking } from '../entity/booking.entity';

@InputType()
export class BookingDetailInput {
  @Field((type) => Int)
  bookingId: number;
}

@ObjectType()
export class BookingDetailOutput extends CoreOutput {
  @Field((type) => Booking, { nullable: true })
  booking?: Booking;

  @Field((type) => User, { nullable: true })
  creator?: User;
}
