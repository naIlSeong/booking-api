import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';

@InputType('PlaceInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Place extends CoreEntity {
  @Field((type) => String)
  placeName: string;

  @Field((type) => String)
  placeLocation: string;

  @Field((type) => [Booking])
  @OneToMany((type) => Booking, (booking) => booking.place, { nullable: true })
  bookings?: Booking[];

  @Field((type) => Boolean)
  @Column({ default: false })
  inUse: boolean;
}
