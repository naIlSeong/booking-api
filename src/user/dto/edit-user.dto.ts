import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ['username', 'password', 'studentId']),
) {}

@ObjectType()
export class EditUserOutput extends CoreOutput {}
