import { extend } from '@hapi/joi';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['username', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
