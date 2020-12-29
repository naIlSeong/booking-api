import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class SearchUserInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchUserOutput extends CoreOutput {
  @Field((type) => [User], { nullable: true })
  users?: User[];
}
