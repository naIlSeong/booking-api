import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Booking } from 'src/booking/entity/booking.entity';
import { CoreEntity } from 'src/common/entity/common.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@InputType('TeamInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Team extends CoreEntity {
  @Field((type) => String)
  @Column()
  teamName: string;

  @Field((type) => [User])
  @OneToMany((type) => User, (user) => user.team)
  members: User[];

  @Field((type) => [Booking])
  @OneToMany((type) => Booking, (booking) => booking.team)
  bookings: Booking[];
}
