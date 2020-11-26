import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/common.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

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
  writeEmail() {
    if (this.studentId) {
      this.studentEmail = `${this.studentId}@jnu.ac.kr`;
    }
  }
}
