import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/common.dto';

@InputType()
export class RegisterParticipantInput {
  @Field((type) => Int)
  participantId: number;

  @Field((type) => Int)
  bookingId: number;
}

@ObjectType()
export class RegisterParticipantOutput extends CoreOutput {}
