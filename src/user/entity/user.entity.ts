import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/common.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Booking } from 'src/booking/entity/booking.entity';
import { Team } from 'src/team/entity/team.entity';

export enum UserRole {
  Admin = 'Admin',
  Individual = 'Individual',
  Representative = 'Representative',
  Member = 'Member',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => Int, { nullable: true })
  @Column({ nullable: true })
  @IsInt()
  studentId?: number;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsEmail()
  studentEmail?: string;

  @Field((type) => String)
  @Column()
  @IsString()
  username: string;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(8)
  password: string;

  @Field((type) => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Individual })
  @IsEnum(UserRole)
  role: UserRole;

  @Field((type) => [Booking], { nullable: true })
  @OneToMany((type) => Booking, (booking) => booking.representative, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  bookings?: Booking[];

  @Field((type) => Team, { nullable: true })
  @ManyToOne((type) => Team, (team) => team.members, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  team?: Team;

  @RelationId((user: User) => user.team)
  teamId: number;

  @BeforeInsert()
  @BeforeUpdate()
  writeEmail(): void {
    try {
      if (this.studentId) {
        this.studentEmail = `${this.studentId}@jnu.ac.kr`;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, +process.env.SALT);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
