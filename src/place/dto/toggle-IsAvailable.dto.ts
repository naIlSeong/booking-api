import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';

@InputType()
export class ToggleIsAvialableInput extends PickType(Place, ['id']) {}

@ObjectType()
export class ToggleIsAvialableOutput extends CoreOutput {
  @Field((type) => Boolean, { nullable: true })
  isAvailable?: boolean;
}
