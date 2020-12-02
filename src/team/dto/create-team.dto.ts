import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';

@InputType()
export class CreateTeamInput extends PickType(Team, ['teamName']) {}

@ObjectType()
export class CreateTeamOutput extends CoreOutput {}
