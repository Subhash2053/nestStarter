import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtUserResponse {
  @Field()
  userId: string;

  @Field()
  username: string;
}
