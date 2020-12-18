import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/common.entity';
import { Team } from 'src/team/entity/team.entity';
import { User } from 'src/user/entity/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Place } from '../../place/entity/place.entity';

@InputType('BookingInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Booking extends CoreEntity {
  @Field((type) => Place)
  @ManyToOne((type) => Place, (place) => place.bookings)
  place: Place;

  @Field((type) => String, { nullable: true })
  @ManyToOne((type) => Team, (team) => team.bookings, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  team?: Team;

  @Field((type) => Int)
  @Column()
  creatorId: number;

  // @RelationId((booking: Booking) => booking.representative)
  // representativeId: number;

  // @Field((type) => [User], { nullable: true })
  // @ManyToMany((type) => User, { nullable: true })
  // @JoinTable()
  // participants?: User[];

  // @RelationId((booking: Booking) => booking.participants)
  // participantIds: number[];

  @Field((type) => Date)
  @Column()
  startAt: Date;

  @Field((type) => Date)
  @Column()
  endAt: Date;

  @Field((type) => Boolean)
  @Column({ default: false })
  inUse: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  isFinished: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  checkDate(): void {
    try {
      if (this.startAt && this.endAt) {
        if (this.startAt >= this.endAt) {
          throw Error();
        }
        if (
          Date.parse(this.endAt.toString()) -
            Date.parse(this.startAt.toString()) <
          1800000
        ) {
          throw Error('Invalid Date');
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
