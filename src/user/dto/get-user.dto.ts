import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class GetUserInput {
  @Field((type) => Int)
  userId: number;
}

@ObjectType()
export class GetUserOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
