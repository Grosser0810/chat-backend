import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConfirmUserInput {
  @Field()
  email: string;

  @Field()
  confirmToken: string;
}