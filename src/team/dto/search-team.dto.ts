import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';

@InputType()
export class SearchTeamInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchTeamOutput extends CoreOutput {
  @Field((type) => [Team], { nullable: true })
  teams?: Team[];
}
