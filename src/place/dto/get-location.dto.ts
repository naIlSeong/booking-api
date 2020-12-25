import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';
import { PlaceLocation } from '../entity/location.entity';

@ObjectType()
export class GetLocationOutput extends CoreOutput {
  @Field((type) => [PlaceLocation], { nullable: true })
  locations?: PlaceLocation[];
}
