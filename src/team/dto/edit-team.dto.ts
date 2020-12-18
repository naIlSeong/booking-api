import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Team } from '../entity/team.entity';

@InputType()
export class EditTeamInput extends PickType(Team, ['teamName']) {}

@ObjectType()
export class EditTeamOutput extends CoreOutput {}
