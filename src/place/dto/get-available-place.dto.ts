import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';

@InputType()
export class GetAvailablePlaceInput {
  @Field((type) => Int)
  locationId: number;
}

@ObjectType()
export class GetAvailablePlaceOutput extends CoreOutput {
  @Field((type) => [Place], { nullable: true })
  places?: Place[];
}
