import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ['username', 'password']),
) {
  @Field((type) => Int, { nullable: true })
  teamId?: number;
}

@ObjectType()
export class EditUserOutput extends CoreOutput {}
