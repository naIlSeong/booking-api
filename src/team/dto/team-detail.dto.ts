import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';

@InputType()
export class TeamDetailInput {
  @Field((type) => Int)
  teamId: number;
}

@ObjectType()
export class TeamDetailOutput extends CoreOutput {
  @Field((type) => Team, { nullable: true })
  team?: Team;
}
