import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsInt } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Field((type) => Date)
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @Field((type) => Date)
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
