import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Booking } from 'src/booking/entity/booking.entity';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
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
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  @IsEnum(UserRole)
  role: UserRole;

  @Field((type) => [Booking])
  @OneToMany((type) => Booking, (booking) => booking.representative, {
    onDelete: 'CASCADE',
  })
  bookings: Booking[];

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
