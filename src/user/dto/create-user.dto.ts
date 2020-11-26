import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUserInput extends PartialType(
  PickType(User, ['studentId', 'username', 'password']),
) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
