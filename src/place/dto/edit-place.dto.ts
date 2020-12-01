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
  PickType(Place, ['placeName', 'inUse']),
) {
  @Field((type) => Int)
  placeId: number;

  @Field((type) => Int)
  locationId: number;
}

@ObjectType()
export class EditPlaceOutput extends CoreOutput {}
