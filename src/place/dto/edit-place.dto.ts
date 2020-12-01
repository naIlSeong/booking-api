import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';

@InputType()
export class EditPlaceInput extends PartialType(
  PickType(Place, ['placeName', 'placeLocation', 'inUse']),
) {
  @Field((type) => Int)
  placeId: number;
}

@ObjectType()
export class EditPlaceOutput extends CoreOutput {}
