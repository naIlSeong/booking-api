import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class DeleteUserInput extends PickType(User, ['id']) {}

@ObjectType()
export class DeleteUserOutput extends CoreOutput {}
