import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';

@ObjectType()
export class GetTeamsOutput extends CoreOutput {
  @Field((type) => [Team], { nullable: true })
  teams?: Team[];
}
