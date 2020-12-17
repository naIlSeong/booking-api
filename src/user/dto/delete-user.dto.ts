import { ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@ObjectType()
export class DeleteUserOutput extends CoreOutput {}
