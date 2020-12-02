import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class ExtendInUseInput {
  @Field((type) => Int)
  bookingId: number;
}

@ObjectType()
export class ExtendInUseOutput extends CoreOutput {}
