import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { Place } from '../entity/place.entity';

@InputType()
export class SearchPlaceInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchPlaceOutput extends CoreOutput {
  @Field((type) => [Place], { nullable: true })
  places?: Place[];
}
