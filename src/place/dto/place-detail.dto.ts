import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';

@InputType()
export class PlaceDetailInput {
  @Field((type) => Int)
  placeId: number;
}

@ObjectType()
export class PlaceDetailOutput extends CoreOutput {
  @Field((type) => Place, { nullable: true })
  place?: Place;
}
