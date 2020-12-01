import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class DeletePlaceInput {
  @Field((type) => Int)
  placeId: number;
}

@ObjectType()
export class DeletePlaceOutput extends CoreOutput {}
