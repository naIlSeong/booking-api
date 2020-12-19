import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/common.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';
import { PlaceLocation } from './location.entity';

@InputType('PlaceInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Place extends CoreEntity {
  @Field((type) => String)
  @Column()
  placeName: string;

  @Field((type) => PlaceLocation)
  @ManyToOne((type) => PlaceLocation, (placeLocation) => placeLocation.places)
  placeLocation: PlaceLocation;

  @Field((type) => [Booking], { nullable: true })
  @OneToMany((type) => Booking, (booking) => booking.place, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  bookings?: Booking[];

  @Field((type) => Boolean)
  @Column({ default: false })
  inUse: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  isAvailable: boolean;
}
