import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { PlaceLocation } from '../entity/location.entity';

@InputType()
export class CreateLocationInput extends PickType(PlaceLocation, [
  'locationName',
]) {}

@ObjectType()
export class CreateLocationOutput extends CoreOutput {}
