import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

@InputType({ isAbstract: true })
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
}
