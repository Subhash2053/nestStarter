import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';

@ObjectType()
export class UserType {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  role: string;
}
