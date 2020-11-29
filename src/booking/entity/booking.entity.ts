import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/common.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Booking extends CoreEntity {
  @Field((type) => String)
  @Column()
  place: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.bookings)
  representative: User;

  @RelationId((booking: Booking) => booking.representative)
  representativeId: number;

  @Field((type) => [User])
  @ManyToMany((type) => User)
  @JoinTable()
  participants: User[];

  @Field((type) => Date)
  @Column()
  bookingAt: Date;
}
