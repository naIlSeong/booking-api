import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { PlaceLocation } from '../entity/location.entity';

@InputType()
export class LocationDetailInput {
  @Field((type) => Int)
  locationId: number;
}

@ObjectType()
export class LocationDetailOutput extends CoreOutput {
  @Field((type) => PlaceLocation, { nullable: true })
  location?: PlaceLocation;
}
