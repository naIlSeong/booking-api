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

@InputType('BookingInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Booking extends CoreEntity {
  @Field((type) => String)
  @Column()
  place: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  teamName?: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.bookings)
  representative: User;

  @RelationId((booking: Booking) => booking.representative)
  representativeId: number;

  @Field((type) => [User], { nullable: true })
  @ManyToMany((type) => User, { nullable: true })
  @JoinTable()
  participants?: User[];

  @Field((type) => Date)
  @Column()
  startAt: Date;

  @Field((type) => Date)
  @Column()
  endAt: Date;
}
