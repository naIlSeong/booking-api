import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class DeleteTeamInput {
  @Field((type) => Int)
  teamId: number;
}

@ObjectType()
export class DeleteTeamOutput extends CoreOutput {}
