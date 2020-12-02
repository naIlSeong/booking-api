import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class RegisterMemberInput {
  @Field((type) => Int)
  memberId: number;
}

@ObjectType()
export class RegisterMemberOutput extends CoreOutput {}
