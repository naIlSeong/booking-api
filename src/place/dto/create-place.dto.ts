import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';

@InputType()
export class CreatePlaceInput extends PickType(Place, [
  'placeName',
  'placeLocation',
]) {}

@ObjectType()
export class CreatePlaceOutput extends CoreOutput {}
