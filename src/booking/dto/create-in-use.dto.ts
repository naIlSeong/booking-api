import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class CreateInUseInput {
  @Field((type) => Int)
  placeId: number;

  @Field((type) => Boolean, { defaultValue: false })
  withTeam?: boolean;
}

@ObjectType()
export class CreateInUseOutput extends CoreOutput {}
