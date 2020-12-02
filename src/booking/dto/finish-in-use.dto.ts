import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class FinishInUseInput {
  @Field((type) => Int)
  bookingId: number;
}

@ObjectType()
export class FinishInUseOutput extends CoreOutput {}
